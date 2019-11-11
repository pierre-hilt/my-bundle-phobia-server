const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: { main: './index.js' },
  mode: 'production',
  output: {
    filename: 'bundle.js',
    pathinfo: false
  },
  externals: {
    // '@angular/core': 'external'
  },
  optimization: {
    namedChunks: true,
    runtimeChunk: { name: 'runtime' },
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
};
