const install = require('./install');
const build = require('./build');
const fs = require('fs-extra');
const zlib = require('zlib');

const stats = require('./stats');
const version = require('./version');

const mockStats = {
  stats: {
    toJson: function() {
      return {
        assets: [
          {
            name: 'main.bundle.js',
            size: 10000
          }
        ]
      };
    }
  }
};

describe('stats util', () => {
  test('should get the stats of a package', async () => {
    zlib.gzipSync = jest.fn().mockReturnValue('abcd');
    version.getLatestVersions = jest.fn().mockResolvedValue(['0.0.0', '1.0.0']);
    install.installPackage = jest.fn();
    fs.readFileSync = jest.fn();
    build.compile = jest.fn().mockResolvedValue(mockStats);
    const results = await stats('react');
    expect(results).toEqual({
      '0.0.0': { size: 10000, gzip: 4 },
      '1.0.0': { size: 10000, gzip: 4 }
    });
  });
});
