/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
// @flow
const spawndamnit = require('spawndamnit');
const fse = require('fs-extra');
const path = require('path');
const bolt = require('bolt');
const git = require('@atlaskit/build-utils/git');
const {
  getChangedPackagesSinceMaster,
  getChangedPackagesSincePublishCommit,
} = require('../utils/packages');

async function getAllFSChangesets() {
  const projectRoot = (await bolt.getProject({ cwd: process.cwd() })).dir;
  const changesetBase = path.join(projectRoot, '.changeset');
  if (!fse.existsSync(changesetBase)) {
    throw new Error('There is no .changeset directory in this project');
  }

  const dirs = fse.readdirSync(changesetBase);
  // this needs to support just not dealing with dirs that aren't set up properly
  return dirs
    .filter(file => fse.lstatSync(path.join(changesetBase, file)).isDirectory())
    .map(changesetDir => {
      const jsonPath = path.join(changesetBase, changesetDir, 'changes.json');
      // $StringLitteral
      return require(jsonPath);
    });
}

async function getNewFSChangesets() {
  const projectRoot = (await bolt.getProject({ cwd: process.cwd() })).dir;
  const paths = await git.getChangedChangesetFilesSinceMaster();
  // $StringLitteral
  return paths.map(filePath => require(path.join(projectRoot, filePath)));
}

/**
 * This is a helper to run a script if a certain package changed.
 * It works by returning a zero code if a tool should be run, so that the normal usage becomes:
 *
 * `node build/ci-scripts/run.if.package.changed @full/package-name -- yarn toolName`.
 * `node build/ci-scripts/run.if.package.changed @full/package-name @another/package-name -- yarn toolName`.
 */
(async () => {
  const args = process.argv.slice(2);

  const dashdashIndex = args.indexOf('--');
  const command = args.slice(dashdashIndex + 1);
  const packageNames = args.slice(0, dashdashIndex);

  if (dashdashIndex < 0 || command.length === 0 || packageNames.length === 0) {
    console.error('Incorrect usage, run it like this:\n');
    console.error(
      '  $ node build/ci-scripts/run.if.package.changed.js [...packages] -- <...command>\n',
    );
    process.exit(1);
  }
  // Take changed files since a commit or master branch
  const branch = await git.getBranchName();

  // Take packages that are going to be released,
  // because using only files is not enough in cases where packages is only dependent of other package
  const newChangesets =
    branch === 'master'
      ? await getAllFSChangesets()
      : await getNewFSChangesets();
  const oldChangesets = await git.getUnpublishedChangesetCommits();
  const unpublishedChangesets = oldChangesets.concat(newChangesets);

  const packagesToRelease = unpublishedChangesets
    .reduce(
      (acc, changeset) =>
        acc.concat(changeset.releases).concat(changeset.dependents),
      [],
    )
    .filter(change => change.type !== 'none');
  const changedPackages =
    branch === 'master'
      ? await getChangedPackagesSincePublishCommit()
      : await getChangedPackagesSinceMaster();

  const matched = !!changedPackages
    .concat(packagesToRelease)
    .find(pkg => packageNames.includes(pkg.name));

  if (!matched) {
    process.exit(0);
  }

  try {
    const res = await spawndamnit(command[0], command.slice(1), {
      stdio: 'inherit',
      tty: (process.stdout && process.stdout.isTTY) || false,
    });

    throw process.exit(res.code);
  } catch (err) {
    if (err instanceof spawndamnit.ChildProcessError) {
      process.exit(err.code);
    } else {
      process.exit(1);
    }
  }
})();
