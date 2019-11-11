/**
 * Take care of the creation of the temporary package to install the package
 * that we want to have the size
 */

const fs = require('fs-extra');
const path = require('path');
const childProcess = require('child_process');
const shortId = require('shortid');

const _installPath = 'tmp/package-build';

const Install = {
  generateInstall(packageName) {
    const id = shortId.generate().slice(0, 3);
    return path.join(_installPath, `${packageName}-${id}`);
  },
  installPackage(packageName, installPath) {
    fs.mkdirpSync(installPath);
    fs.writeFileSync(path.join(installPath, 'package.json'), JSON.stringify({ dependencies: {} }));
    childProcess.execSync(
      `npm install ${packageName} --no-package-lock --progress false --loglevel error`,
      {
        cwd: installPath,
        maxBuffer: 1024 * 500
      }
    );
    return installPath;
  },
  cleanUp() {
    return fs.remove(_installPath);
  }
};

module.exports = Install;
