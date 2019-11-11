# My Bundle Phobia Server

This project is a re-write of Bundle Phobia Backend.

## Get versions

The last 3 versions and the last major version of a package is retrieved calling
npm registry. NPM registry send back list of all versions of a package.

## Install

A new NPM package is created in tmp folder. NPM is then use to install the package we want to test.

## Build

The package is then build using Webpack, importing the module to test.
If a missing dependency is found, a new build is started with the missing dependencies as
webpack external.

## Stats

The bundle created is used to calculate the minify size. The content is then Gziped to have the gzip size.

## Caching

A memory caching is in place to store the stats of the package.
An improvment would be to set a persitent storage.

## Improvment

Right now, the consumer of the API needs to wait the end of all builds to start receiving results.
The API could be split in several APIs, one to determine the versions, then an API to install
and build each version.
Add more logging on the API.
Add more error handling, for now errors are returned without processing.
