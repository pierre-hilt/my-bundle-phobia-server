/**
 * Entry point of the project.
 * Process all the needed actions to get the statistic of a package
 */

const install = require('./install');
const version = require('./version');
const build = require('./build');

const zlib = require('zlib');
const fs = require('fs-extra');
const path = require('path');

const NodeCache = require('node-cache');
const myCache = new NodeCache();

function getMinifiedSize(jsonStats) {
  return jsonStats.assets.find(asset => asset.name === 'main.bundle.js').size;
}

function getGzipSize(installPath) {
  const bundleContents = fs.readFileSync(path.join(installPath, 'main.bundle.js'));
  return zlib.gzipSync(bundleContents, {}).length;
}

function getModuleNotFoundError(errors) {
  const moduleNotFoundErrors = errors.filter(
    error => error.indexOf('Module not found: Error') !== -1
  );

  if (moduleNotFoundErrors.length === 0) {
    return [];
  }

  const moduleNotFoundsRegex = /Can't resolve '(.+)' in/;

  return moduleNotFoundErrors.map(err => {
    const matches = err.toString().match(moduleNotFoundsRegex);
    return matches[1];
  });
}

async function stats(packageName) {
  const buildStats = {};
  const versions = await version.getLatestVersions(packageName);
  for (const versionToInstall of versions) {
    const versionedName = `${packageName}@${versionToInstall}`;

    const cachedValue = myCache.get(versionedName);

    if (cachedValue) {
      console.log('Value found in cache', versionedName);
      buildStats[versionToInstall] = cachedValue;
      continue;
    }

    const installPath = install.generateInstall(versionedName);

    install.installPackage(versionedName, installPath);
    const { stats } = await build.compile(packageName, installPath);

    let jsonStats = stats.toJson();

    if (jsonStats.errors) {
      const externals = getModuleNotFoundError(jsonStats.errors);
      if (externals) {
        // In this case there is a needed module not installed (peer dependency)
        // We need to mark it as externals for webpack
        const { stats } = await build.compile(packageName, installPath, externals);
        jsonStats = stats.toJson();
      } else {
        throw new Error('Compilation error');
      }
    }

    const buildStat = {
      size: getMinifiedSize(jsonStats),
      gzip: getGzipSize(installPath)
    };

    myCache.set(versionedName, buildStat);

    buildStats[versionToInstall] = buildStat;
  }
  return buildStats;
}

module.exports = stats;
