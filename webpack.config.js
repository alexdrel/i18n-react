var webpack = require("webpack");

module.exports = {
  entry: { hello: './examples/hello.jsx' },
  output: {
    path: './examples/build',
    publicPath: 'build',
    filename: '[name].js',
    chunkFilename: '[name].[id].js'
  },
  externals: {
    "react": "React"
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: [ '.', 'node_modules', 'examples'],
  },
  module: {
    loaders: [
      { test: /\.jsx$/, loader: 'jsx?harmony' },
      { test: /\.ya?ml$/, loader: 'json!yaml' }
    ]
  },

  devServer: {
    contentBase: "./examples",
    noInfo: true,
    stats: true
  }
}
