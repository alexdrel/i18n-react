var webpack = require("webpack");

module.exports = {
  entry: {
    hello: './examples/hello/index.jsx',
    syntaxV1: './examples/syntaxV1/index.tsx',
    yaml: './examples/yaml/index.jsx'
  },
  output: {
    filename: './examples/[name]/build/index.js'
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [ '.', 'node_modules' ],
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { test: /\.jsx$/, loader: 'jsx-loader?harmony' },
      { test: /\.ya?ml$/, loader: 'json-loader!yaml-loader' }
    ]
  },
  devtool: "eval",
  devServer: {
    noInfo: false,
    stats: true
  }
};
