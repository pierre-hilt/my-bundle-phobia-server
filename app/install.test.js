const install = require('./install');
const fs = require('fs-extra');
const path = require('path');

describe('install util', () => {
  afterAll(done => {
    fs.remove('tmp').then(_ => done());
  });

  test('should install a package without a version', () => {
    const installPath = install.generateInstall('react');
    install.installPackage('react', installPath);
    expect(installPath).toEqual(expect.stringContaining('react'));
    expect(fs.existsSync(path.join(installPath, 'node_modules/react'))).toBeTruthy();
    const packageJson = require(path.resolve(
      path.join(installPath, 'node_modules/react/package.json')
    ));
    expect(packageJson.version).toBeDefined();
  });

  test('should install a package with a version', () => {
    const versionedName = 'react@15.0.0';
    const installPath = install.generateInstall(versionedName);
    install.installPackage(versionedName, installPath);
    expect(installPath).toEqual(expect.stringContaining('react'));
    expect(fs.existsSync(path.join(installPath, 'node_modules/react'))).toBeTruthy();
    const packageJson = require(path.resolve(
      path.join(installPath, 'node_modules/react/package.json')
    ));
    expect(packageJson.version).toEqual('15.0.0');
  });
});
