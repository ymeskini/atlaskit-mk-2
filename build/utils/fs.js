// @flow

const fs = require('fs');
const util = require('util');

function writeFile(filePath /*: string */, fileContents /*: string */) {
  return util.promisify(cb => fs.writeFile(filePath, fileContents, cb))();
}

function readFile(filePath /*: string */) {
  return util.promisify(cb => fs.readFile(filePath, cb))();
}

function readdir(filePath /*: string */) {
  return util.promisify(cb => fs.readdir(filePath, cb))();
}

function rename(oldPath /*: string */, newPath /*: string */) {
  return util.promisify(cb => fs.rename(oldPath, newPath, cb))();
}

function mkdtemp(prefix /*: string */) {
  return util.promisify(cb => fs.mkdtemp(prefix, cb))();
}

function stat(filePath /*: string */) {
  return util.promisify(cb => fs.stat(filePath, cb))();
}

async function exists(filePath /*: string */) {
  try {
    await stat(filePath);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
}

module.exports = {
  writeFile,
  readFile,
  rename,
  mkdtemp,
  stat,
  exists,
  readdir,
};
