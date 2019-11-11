const path = require('path');
const fs = require('fs-extra');

const webpack = require('webpack');

const getWebpackConf = require('./webpack.config');

const Build = {
  createIndex(packageName, installPath) {
    const indexPath = path.join(installPath, 'index.js');
    const importStatement = `const p = require('${packageName}');`;
    fs.writeFileSync(indexPath, importStatement);
    return indexPath;
  },

  compile(packageName, installPath) {
    const indexPath = this.createIndex(packageName, installPath);
    const compiler = webpack(getWebpackConf(indexPath, installPath));

    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        resolve({ stats, err });
      });
    });
  }
};

module.exports = Build;