const { override } = require('customize-cra');

module.exports = override(
  (config) => {
    // Disable source map generation
    config.devtool = false;
    return config;
  }
);