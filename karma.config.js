// Karma configuration

module.exports = function (config) {
  config.set({
    // ... normal karma configuration
    basePath: '',
    frameworks: ['jasmine'],

    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    files: [
      "https://cdnjs.cloudflare.com/ajax/libs/react/16.0.0/umd/react.development.js",
      "https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.0.0/umd/react-dom-server.browser.development.js",
      // all files ending in "_test"
      'tests/*_test.*',
      'tests/**/*_test.*'
      // each file acts as entry point for the webpack configuration
    ],

    preprocessors: {
      // add webpack as preprocessor
      'tests/*_test.*': ['webpack', 'sourcemap'],
      'tests/**/*_test.*': ['webpack', 'sourcemap']
    },

    port: 8055,
    logLevel: config.LOG_INFO,
    colors: true,
    autoWatch: true,

    browsers: ['Chrome'],
    reporters: ['progress'],
    captureTimeout: 60000,
    singleRun: false,

    webpack: {
      cache: true,
      devtool: 'inline-source-map',
      stats: false,

      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      },

      externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "react-dom-server": "ReactDOMServer",
      },

      module: {
        loaders: [
          { test: /\.tsx?$/, loader: 'ts-loader' },
          { test: /\.jsx?$/, loader: 'jsx-loader?harmony' }
        ]
      },
    },
  });
};
