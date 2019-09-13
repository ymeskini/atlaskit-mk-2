/**
 * @file validate.dists
 *
 * Validates built output of packages, ensuring that the correct dist and entry point folders are created, and that they have correct contents.
 *
 * This also guards against the problem below:
 *
 * TypeScript compiler has this weird problem where it sometimes decides to also build
imported code. When this happens the code we want to distribute actually ends up in a sub-dir instead of
the target output dir.

For example in editor-core we once ended up with the following structure (when we were outputting to the root rather than dist):
- editor/editor-core/editor-core
- editor/editor-core/elements
- etc...

Where-as expected would be:
- editor/editor-core/index.js
- editor/editor-core/components/*
- etc....
*/
const fse = require('fs-extra');
const outdent = require('outdent');
const pSettle = require('p-settle');
const { getPackagesInfo } = require('@atlaskit/build-utils/tools');

/**
 * These are public browser packages (packages that don't live under /build) that don't use the standard
 * cjs/esm build process. They must be explicitly listed here to avoid failing build validation.
 * This guards us against accidentally missing these fields in package.json.
 */
const nonCjsEsmPackages = [
  '@atlaskit/updater-cli',
  '@atlaskit/dependency-version-analytics',
  '@atlaskit/code-insights',
  '@atlaskit/branch-deploy-product-integrator',
  '@atlaskit/icon',
  '@atlaskit/css-reset',
  '@atlaskit/reduced-ui-pack',
];

// These files are excluded from being copied to dist
// If we need to exclude package specific stuff we can read from tsconfig if we really want
const excludedSrcFiles = ['__mocks__', '__tests__', '__fixtures__'];

// Regular .js, .ts or .tsx file, excluding d.ts files.
const fileRegex = /\.(js|(?<!d\.)tsx?)$/;

function validateEntryPoints(srcContents, rootContents) {
  const missingEntries = srcContents.filter(
    srcFile =>
      srcFile.isFile() &&
      srcFile.name.match(fileRegex) &&
      !srcFile.name.includes('index') &&
      !rootContents.find(
        f => f.isDirectory() && f.name === srcFile.name.replace(fileRegex, ''),
      ),
  );
  return missingEntries;
}

async function validateAllPackages(packageDirs) {
  const results = await Promise.all(
    packageDirs.map(dir => validatePackage(dir)),
  );
  const errors = [].concat(...results);
  return errors;
}

async function validatePackage(packageDir) {
  const errors = [];
  const dirs = await pSettle(
    ['src', '', 'dist/cjs', 'dist/esm'].map(async f => {
      const dir = `${packageDir}/${f}`;
      return {
        dir,
        contents: await fse.readdir(dir, {
          withFileTypes: true,
        }),
      };
    }),
  );
  const failedDirs = dirs.filter(p => p.isRejected).map(p => p.reason);
  if (failedDirs.length > 0) {
    errors.push(...failedDirs);
    return errors;
  }

  const [src, root, ...dists] = dirs.map(p => p.value);

  errors.push(
    ...validateEntryPoints(src.contents, root.contents).map(
      f => `Missing entry point directory for "${src.dir}/${f.name}"`,
    ),
  );
  for (const dist of dists) {
    errors.push(...validateDistContents(src, dist));
  }

  return errors;
}

function validateDistContents(src, dist) {
  const errors = [];
  for (const srcFile of src.contents) {
    if (excludedSrcFiles.includes(srcFile.name)) {
      continue;
    }
    if (srcFile.isDirectory()) {
      const correspondingDir = dist.contents.find(
        distFile => distFile.name === srcFile.name && distFile.isDirectory(),
      );
      if (!correspondingDir) {
        errors.push(
          `Directory "${src.dir}/${srcFile.name}" is missing in "${dist.dir}"`,
        );
      }
    } else if (srcFile.isFile()) {
      const compiledFilename = srcFile.name.replace(fileRegex, '.js');
      const compiledFile = dist.contents.find(
        distFile => distFile.name === compiledFilename && distFile.isFile(),
      );
      if (!compiledFile) {
        errors.push(
          `File "${srcFile.name}" is missing as "${
            dist.dir
          }/${compiledFilename}"`,
        );
      }
      if (srcFile.name.match(/\.tsx?$/)) {
        const declarationFilename = srcFile.name.replace(fileRegex, '.d.ts');
        const declarationFile = dist.contents.find(
          distFile =>
            distFile.name === declarationFilename && distFile.isFile(),
        );
        if (!declarationFile) {
          errors.push(
            `Declaration file for "${srcFile.name}" is missing as "${
              dist.dir
            }/${declarationFilename}"`,
          );
        }
      }
    } else {
      throw Error(`Invalid file "${srcFile}", must be directory or file.`);
    }
  }
  return errors;
}

function hasCjsEsmBuild(pkg) {
  return (
    pkg.config.main === 'dist/cjs/index.js' &&
    pkg.config.module === 'dist/esm/index.js'
  );
}

async function main(opts = {}) {
  const { cwd = process.cwd(), packageName } = opts;
  const packagesInfo = await getPackagesInfo(cwd);

  /* We only want to check packages that ship cjs + esm */
  const browserPackages = packagesInfo.filter(
    pkg =>
      pkg.isBrowserPackage &&
      !pkg.config.private &&
      !nonCjsEsmPackages.includes(pkg.name) &&
      // Scope to a single package if packageName is provided
      (!packageName || packageName === pkg.name),
  );
  const unaccountedPackages = browserPackages.filter(
    pkg => !hasCjsEsmBuild(pkg),
  );
  if (unaccountedPackages.length > 0) {
    throw new Error(outdent`
      Found ${
        unaccountedPackages.length
      } packages that don't have a cjs/esm build but are not on the exception list:
      ${unaccountedPackages.map(pkg => pkg.name).join('\n')}
      Either fix their main/module field or add them to the exception list at "${__filename}"`);
  }

  const standardPackages = browserPackages
    .filter(pkg => hasCjsEsmBuild(pkg))
    .map(pkg => pkg.dir);

  const packageDistErrors = await validateAllPackages(standardPackages);
  return {
    success: packageDistErrors.length === 0,
    packageDistErrors,
  };
}

if (require.main === module) {
  main({ packageName: process.argv[2] })
    .then(({ success, packageDistErrors }) => {
      if (!success) {
        console.error(
          `${
            packageDistErrors.length
          } errors detected in package dists:\n * ${packageDistErrors.join(
            '\n * ',
          )}`,
        );
        process.exit(1);
      } else {
        console.log('Success');
      }
    })
    .catch(e => {
      console.error(e);
      process.exit(2);
    });
}

module.exports = main;
