/**
 * Call NPM registry to retrieve the last 3 versions and last major version
 */
const request = require('request');
const semver = require('semver');

const Version = {
  getLatestVersions(packageName) {
    return new Promise((resolve, reject) => {
      request.get('https://registry.npmjs.org/' + packageName, (error, response, body) => {
        if (error) {
          reject('HTTP error ');
          return;
        }

        if (response && response.statusCode === 404) {
          reject('Package does not exists');
          return;
        }

        const packageInfo = JSON.parse(body);
        // Pre release versions are filtered out
        const allSortedVersions = Object.keys(packageInfo.versions)
          .sort(semver.compare)
          .filter(v => semver.prerelease(v) === null);

        const currentMajorVersion = semver.major(allSortedVersions.slice(-1)[0]);

        const lastThreeVersion = allSortedVersions
          .filter(version => semver.major(version) === currentMajorVersion)
          .slice(-3);

        let previousVersion = undefined;
        if (currentMajorVersion > 0) {
          // find the first version that is not the latest major version
          previousVersion = allSortedVersions
            .reverse()
            .find(v => semver.major(v) !== currentMajorVersion);
        }

        if (previousVersion) {
          resolve([previousVersion, ...lastThreeVersion]);
        } else {
          resolve([...lastThreeVersion]);
        }
      });
    });
  }
};

module.exports = Version;
