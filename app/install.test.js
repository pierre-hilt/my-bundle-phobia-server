const install = require('./install');
const fs = require('fs-extra');
const path = require('path');

const packageWithoutVersion = 'react';
const packageWithVersion = 'react@15.0.0';
const scopedPackage = '@angular/common';
const scopedPackageWithVersion = '@angular/common@8.0.0';

describe('generate install path', () => {
  test('should generate install path without a version', () => {
    installPath = install.generateInstall(packageWithoutVersion);
    expect(installPath).toEqual(expect.stringContaining('react'));
  });

  test('should generate install path with a version', () => {
    installPath = install.generateInstall(packageWithVersion);
    expect(installPath).toEqual(expect.stringContaining('react'));
  });
  test('should generate path for scoped package', () => {
    installPath = install.generateInstall(scopedPackage);
    expect(installPath).toEqual(expect.stringContaining('angular-common'));
  });

  test('should generate path for scoped package with version', () => {
    installPath = install.generateInstall(scopedPackageWithVersion);
    expect(installPath).toEqual(expect.stringContaining('angular-common'));
  });
});

describe('install util', () => {
  let installPath = '';
  afterEach(() => {
    // if (installPath.startsWith('tmp')) fs.removeSync(installPath);
  });

  test('should install a package without a version', () => {
    installPath = 'tmp-test\\package-build\\package';
    install.installPackage(packageWithVersion, installPath);
    expect(fs.existsSync(path.join(installPath, 'node_modules/react'))).toBeTruthy();
    const packageJson = require(path.resolve(
      path.join(installPath, 'node_modules/react/package.json')
    ));
    expect(packageJson.version).toBeDefined();
  });

  test('should install a package with a version', () => {
    installPath = 'tmp-test\\package-build\\package-with-version';
    install.installPackage(packageWithVersion, installPath);
    expect(fs.existsSync(path.join(installPath, 'node_modules/react'))).toBeTruthy();
    const packageJson = require(path.resolve(
      path.join(installPath, 'node_modules/react/package.json')
    ));
    expect(packageJson.version).toEqual('15.0.0');
  });

  test('should install for scoped package', () => {
    installPath = 'tmp-test\\package-build\\package-scoped';
    install.installPackage(scopedPackage, installPath);
    expect(fs.existsSync(path.join(installPath, 'node_modules/@angular/common'))).toBeTruthy();
    const packageJson = require(path.resolve(
      path.join(installPath, 'node_modules/@angular/common/package.json')
    ));
    expect(packageJson.version).toBeDefined();
  });

  test('should install for scoped package with version', () => {
    installPath = 'tmp-test\\package-build\\package-scoped-version';
    install.installPackage(scopedPackageWithVersion, installPath);
    expect(fs.existsSync(path.join(installPath, 'node_modules/@angular/common'))).toBeTruthy();
    const packageJson = require(path.resolve(
      path.join(installPath, 'node_modules/@angular/common/package.json')
    ));
    expect(packageJson.version).toEqual('8.0.0');
  });
});
