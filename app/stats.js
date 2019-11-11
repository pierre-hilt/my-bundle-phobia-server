const install = require('./install');
const version = require('./version');
const build = require('./build');

const zlib = require('zlib');
const fs = require('fs-extra');
const path = require('path');

function getMinifiedSize(stats) {
  return stats.toJson().assets.find(asset => asset.name === 'main.bundle.js').size;
}

function getGzipSize(installPath) {
  const bundleContents = fs.readFileSync(path.join(installPath, 'main.bundle.js'));
  return zlib.gzipSync(bundleContents, {}).length;
}

async function stats(packageName) {
  const buildStats = {};
  const versions = await version.getLatestVersions(packageName);
  for (const versionToInstall of versions) {
    const versionedName = `${packageName}@${versionToInstall}`;
    const installPath = install.generateInstall(versionedName);

    install.installPackage(versionedName, installPath);
    const { stats } = await build.compile(packageName, installPath);

    buildStats[versionToInstall] = {
      size: getMinifiedSize(stats),
      gzip: getGzipSize(installPath)
    };
  }
  return buildStats;
}

module.exports = stats;
