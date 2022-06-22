const path = require('path');

const CracoAntDesignPlugin = require('craco-antd');
const rewireBabelLoader = require('craco-babel-loader');

module.exports = {
    plugins: [
        {
            plugin: CracoAntDesignPlugin,
            options: {
                customizeTheme: {
                    '@primary-color': '#0783C1',
                },
            },
        },
        {
            plugin: rewireBabelLoader,
            options: {
                includes: [
                    path.resolve('src'),
                    path.resolve('../shared/src'),
                    path.resolve('../node_modules/aidbox-react/src'),
                ],
            },
        },
    ],
};