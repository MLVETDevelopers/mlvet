// eslint-disable-next-line import/no-unresolved
const pkg = require('../package.json');

// Set electron-builder property 'version' to be the same as package.json 'version'
// If we don't do this then it will default to the erb package.json 'version' = 0.4.5
pkg.build.extraMetadata.version = pkg.version;

require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));
