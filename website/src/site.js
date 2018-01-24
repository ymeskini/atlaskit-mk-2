// @flow
import type { Directory, File } from './types';

// SITE_DATA is dynamically generated at runtime by bolt-fs-loader.
// Configuration for bolt-fs-loader is in webpack.config.js since it needs to be dynamically created
// depending on the subset of packages we want to represent on the website.
// $FlowFixMe
import data from './SITE_DATA';
import NAV_DATA from './NAV_DATA';
import * as fs from './utils/fs';

const siteData: Directory = data;
export default siteData;

const dirs = fs.getDirectories(data.children);

function isInternal(groupId, pkgId) {
  const pkgInfo = NAV_DATA[groupId].find(a => a.name === pkgId);
  return (
    pkgInfo &&
    pkgInfo.config &&
    pkgInfo.config.atlaskit &&
    pkgInfo.config.atlaskit.internal
  );
}

let publicPackages = {
  type: 'dir',
  id: 'packages',
  children: [],
};

let a: Directory = fs.getById(dirs, 'packages');

for (let child of fs.getDirectories(a.children)) {
  let children = child.children.filter(pkg => !isInternal(child.id, pkg.id));
  publicPackages.children.push(Object.assign({}, child, { children }));
}

export const docs: Directory = fs.getById(dirs, 'docs');
export const packages: Directory = fs.getById(dirs, 'packages');
export const externalPackages: Directory = publicPackages;
export const pkgData = NAV_DATA;
export const patterns: Directory = fs.maybeGetById(dirs, 'patterns') || {
  id: 'patterns',
  type: 'dir',
  children: [],
};
