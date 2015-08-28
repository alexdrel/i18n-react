var webpack = require("webpack");

module.exports = {
  entry: {
    "i18n-react": "./src/i18n-react.ts",
  },
  output: {
    path: './dist/',
    filename: 'i18n-react.umd.js',
    library: 'i18n-react',
    libraryTarget: "umd"
  },
  externals: {
    "react": "React"
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.ts'],
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts' }
    ]
  },
  progress: true,
  devtool: "sourcemap"
}
