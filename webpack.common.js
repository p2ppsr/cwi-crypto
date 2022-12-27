const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    globalObject: 'this',
    library: {
      type: 'umd',
      name: 'CWICrypto'
    },
    filename: 'cwi-crypto.js'
  },
  plugins: [
    new NodePolyfillPlugin()
  ],
  externals: {
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'bn.js': path.resolve(__dirname, 'node_modules/bn.js'),
      'safe-buffer': path.resolve(__dirname, 'node_modules/safe-buffer')
    }
  }
}
