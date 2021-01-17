import * as Sentry from '@sentry/react-native';

import { setInstanceBaseURL } from 'aidbox-react/src/services/instance';

import config from 'shared/src/config';


if (config.mobileSentryDSN) {
    Sentry.init({
        dsn: config.mobileSentryDSN!,
    });
    Sentry.setTag('environment', config.tier);
}

setInstanceBaseURL(config.baseURL);
