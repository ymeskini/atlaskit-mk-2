const path = require('path');
const pyarn = require('pyarn');
const cli = require('../../utils/cli');
const git = require('../../utils/git');
const parseChangesetCommit = require('../version/parseChangeSetCommit');
const createRelease = require('../version/createRelease');
const createReleaseCommit = require('../version/createReleaseCommit');
const fs = require('../../utils/fs');

async function bumpReleasedPackages(releaseObj, allPackages) {
  for (const release of releaseObj.releases) {
    const pkgDir = allPackages.find(pkg => pkg.name === release.name).dir;
    const pkgJsonPath = path.join(pkgDir, 'package.json');
    const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath));

    pkgJson.version = release.version;
    const pkgJsonStr = `${JSON.stringify(pkgJson, null, 2)}\n`;
    await fs.writeFile(pkgJsonPath, pkgJsonStr);
  }
}

async function run() {
  const allPackages = await pyarn.getWorkspaces();
  const lastPublishCommit = await git.getLastPublishCommit();
  const unreleasedChangesetsPromises = (await git.getChangesetCommitsSince(lastPublishCommit))
    .map(commitHash => git.getFullCommit(commitHash));
  const unreleasedChangesets = (await Promise.all(unreleasedChangesetsPromises))
    .map(({ commit, message }) => ({ commit, ...parseChangesetCommit(message) }));
  const releaseObj = createRelease(unreleasedChangesets, allPackages);

  await bumpReleasedPackages(releaseObj, allPackages);

  const publishCommit = createReleaseCommit(releaseObj);

  /** TODO: Update changelogs here */
  // changelog.updateChangeLog(releaseObj);

  console.log(publishCommit);
  const runPublish = await cli.askConfirm('Publish these packages?');
  if (runPublish) {
    pyarn.run('publish', { access: 'public' });
  }
}

module.exports = {
  run,
};
