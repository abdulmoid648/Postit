const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../server/.env') });

const app = require('../server/index.js');

module.exports = app;
