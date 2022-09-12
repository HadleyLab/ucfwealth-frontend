import commonConfig from './config.common';

export default {
    ...commonConfig,

    tier: 'develop',
    baseURL: window.BASE_URL,

    webSentryDSN: null,
    mobileSentryDSN: null,
};
