const Version = require('./version');
const request = require('request');

const mock = require('./version-mock/react.mock.json');
const unknown = require('./version-mock/unknown-package.mock.json');
const oneVersion = require('./version-mock/one-version.mock.json');
const missingVersion = require('./version-mock/missing-major.mock.json');
const prerelease = require('./version-mock/prerelease.mock.json');

describe('version util', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should call request get', () => {
    const spy = jest.spyOn(request, 'get').mockImplementation(() => {});
    Version.getLatestVersions('react');
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toEqual('https://registry.npmjs.org/react');
  });

  test('should return list of latest versions', done => {
    jest.spyOn(request, 'get').mockImplementation((url, cb) => {
      cb(null, {}, JSON.stringify(mock));
    });
    Version.getLatestVersions('react').then(error => {
      expect(error).toEqual(['15.6.2', '16.10.1', '16.10.2', '16.11.0']);
      done();
    });
  });

  test('should not return any version if package is unknown', done => {
    jest.spyOn(request, 'get').mockImplementation((url, cb) => {
      cb(null, { statusCode: 404 }, JSON.stringify(unknown));
    });
    Version.getLatestVersions('tototata').catch(error => {
      expect(error).toEqual('Package does not exists');
      done();
    });
  });

  test('should not return previous major version if not exists', done => {
    jest.spyOn(request, 'get').mockImplementation((url, cb) => {
      cb(null, {}, JSON.stringify(oneVersion));
    });
    Version.getLatestVersions('toto').then(version => {
      expect(version).toEqual(['0.0.1', '0.0.2']);
      done();
    });
  });

  test('should work if latest major version is missing', done => {
    jest.spyOn(request, 'get').mockImplementation((url, cb) => {
      cb(null, {}, JSON.stringify(missingVersion));
    });
    Version.getLatestVersions('toto').then(version => {
      expect(version).toEqual(['0.0.2', '2.0.2']);
      done();
    });
  });

  test('should filter out prerelease versions', done => {
    jest.spyOn(request, 'get').mockImplementation((url, cb) => {
      cb(null, {}, JSON.stringify(prerelease));
    });
    Version.getLatestVersions('react').then(version => {
      expect(version).toEqual(['0.0.1']);
      done();
    });
  });
});
