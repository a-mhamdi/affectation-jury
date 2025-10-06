const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const mode = process.env.NODE_ENV || 'development';

module.exports = {
    entry: './public/js/script.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/dist'),
    },
    mode: mode
};