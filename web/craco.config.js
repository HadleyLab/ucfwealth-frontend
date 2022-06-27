const path = require('path');

const CracoAntDesignPlugin = require('craco-antd');
const rewireBabelLoader = require('craco-babel-loader');

module.exports = {
    plugins: [
        {
            plugin: CracoAntDesignPlugin,
            options: {
                customizeTheme: {
                    '@primary-color': '#1491BD',
                    '@font-size-base': '14px',
                    '@primary-yellow': '#eab800',
                    '@black': '#000000',
                    '@white': '#ffffff',
                    '@menu-bg': '@black',
                    '@menu-item-color': '@white',
                    '@menu-highlight-color': '@primary-yellow',
                    '@menu-item-active-bg': '@black',
                    '@menu-item-active-danger-bg': '@black',
                    '@layout-header-background': '@black',
                    '@menu-item-font-size': '@font-size-base',
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
