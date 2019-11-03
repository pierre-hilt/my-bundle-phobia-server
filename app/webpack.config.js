const path = require('path');

function getWebpackConfiguration(indexPath, installPath) {
  return {
    entry: { main: path.resolve('./', indexPath) },
    mode: 'production',
    output: {
      filename: 'bundle.js',
      path: path.resolve('./', installPath),
      pathinfo: false
    },
    optimization: {
      namedChunks: true,
      runtimeChunk: { name: 'runtime' }
    }
  };
}

module.exports = getWebpackConfiguration;
