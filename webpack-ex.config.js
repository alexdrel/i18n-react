var webpack = require("webpack");

module.exports = {
  entry: {
    hello: './examples/hello/index.jsx',
    yaml: './examples/yaml/index.jsx'
  },
  output: {
    filename: './examples/[name]/build/index.js'
  },
  externals: {
    "react": "React"
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: [ '.', 'node_modules' ],
  },
  module: {
    loaders: [
      { test: /\.jsx$/, loader: 'jsx?harmony' },
      { test: /\.ya?ml$/, loader: 'json!yaml' }
    ]
  },
  devtool: "eval",
  devServer: {
    noInfo: false,
    stats: true
  }
}
