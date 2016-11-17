module.exports = {
  entry: './src/index.js',
  output: {
    path: 'build',
    filename: 'bundle.js'
  },
  devtool: 'eval-source-map',
  resolve: {
    root: __dirname,
    packageAlias: 'browser'
  },
  target: 'electron',
  externals: {
    "polymer": "Polymer"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader?cacheDirectory'
    }]
  }
}
