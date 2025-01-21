import { theme as ANTDTheme, ThemeConfig } from 'antd';
import _ from 'lodash';
import { DefaultTheme } from 'styled-components';

import { colors, getPalette } from './palette';

const { getDesignToken } = ANTDTheme;

interface Props {
    dark?: boolean;
    palette?: Partial<DefaultTheme>;
}

export function getANTDTheme({ dark, palette: newPalette }: Props): ThemeConfig {
    const palette = _.merge({}, getPalette({ dark }), newPalette ?? {});

    const config: ThemeConfig = {
        token: {
            colorText: palette.neutral.primaryText,
            colorPrimary: colors.primary,
            colorLink: palette.link,
            colorLinkHover: palette.primaryPalette.bcp_5,
            colorLinkActive: palette.primaryPalette.bcp_7,
            colorError: palette.error,
            colorSuccess: palette.success,
            colorWarning: palette.warning,
            colorInfo: palette.primaryPalette.bcp_6,
            fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
  'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
  'Noto Color Emoji'`,
            borderRadius: 2,
        },
        algorithm: dark ? ANTDTheme.darkAlgorithm : ANTDTheme.defaultAlgorithm,
        components: {
            Typography: {
                titleMarginBottom: 0,
                titleMarginTop: 0,
            },
            Layout: {
                colorBgHeader: palette.neutral.sidebarBackground,
                colorBgBody: palette.neutralPalette.gray_2,
            },
            Result: {
                colorSuccess: palette.secondary,
            },
        },
    };

    const defaultTokens = getDesignToken(config);

    return _.merge({}, { token: defaultTokens }, config);
}
