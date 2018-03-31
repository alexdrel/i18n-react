var webpack = require("webpack");

module.exports = {
  entry: {
    hello: './examples/hello/index.jsx',
    syntaxV1: './examples/syntaxV1/index.tsx',
    yaml: './examples/yaml/index.jsx',
    "yaml-ts": './examples/yaml-ts/index.tsx'
  },
  output: {
    filename: './examples/[name]/build/index.js'
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx'],
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
