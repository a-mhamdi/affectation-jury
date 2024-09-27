const path = require('path');

module.exports = {
  entry: './public/js/script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist'),
  },
  mode: 'production',
};