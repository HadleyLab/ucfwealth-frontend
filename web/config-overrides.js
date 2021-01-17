const path = require('path');

const { override, babelInclude } = require('customize-cra');

module.exports = override(
    babelInclude([
        path.resolve('src'),
        path.resolve('../shared/src'),
        path.resolve('../node_modules/aidbox-react/src'),
    ]),
);
