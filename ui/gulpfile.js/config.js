var config = require('../config');
var argv = require('yargs').argv;

if (argv.dest) {
    config.root.dest = argv.dest;
}
if (argv.assetsDest) {
    config.assets.dest = argv.assetsDest;
}

module.exports = config;