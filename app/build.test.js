const install = require('./install');
const build = require('./build');
const fs = require('fs-extra');
const path = require('path');

describe('build util', () => {
  test('should create the index js', () => {
    const installPath = install.generateInstall('react');
    install.installPackage('react', installPath);
    const indexPath = build.createIndex('react', installPath);
    expect(fs.existsSync(indexPath)).toBeTruthy();
  });

  test('should build the project', done => {
    const installPath = install.generateInstall('react');
    install.installPackage('react', installPath);
    const indexPath = build.createIndex('react', installPath);
    build.compile(indexPath, installPath).then(({ stats, err }) => {
      expect(fs.existsSync(path.join(installPath, 'bundle.js'))).toBeTruthy();
      done();
    });
  });

  test('should build the project', done => {
    const installPath = install.generateInstall('semver', '6.3.0');
    install.installPackage('semver', installPath);
    const indexPath = build.createIndex('semver', installPath);
    build.compile(indexPath, installPath).then(({ stats, err }) => {
      expect(fs.existsSync(path.join(installPath, 'bundle.js'))).toBeTruthy();
      done();
    });
  });
});
