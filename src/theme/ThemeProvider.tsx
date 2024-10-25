import { ConfigProvider as ANTDConfigProvider } from 'antd';
import _ from 'lodash';
import { ReactNode } from 'react';
import { DefaultTheme, ThemeProvider as StyledComponentsThemeProvider, createGlobalStyle } from 'styled-components';

import { useTheme } from '@beda.software/emr/utils';

import { getAppTheme, getANTDTheme } from './';

interface Props {
    theme?: 'dark' | 'light';
    children: ReactNode;
    palette?: Partial<DefaultTheme>;
}

const GlobalStyle = createGlobalStyle<{ $whiteColor?: boolean }>`
  :root {
    --theme-icon-primary: ${({ theme }) => theme.iconColors.primary};
    --theme-icon-secondary: ${({ theme }) => theme.iconColors.secondary};
    --theme-sidebar-background: ${({ theme }) => theme.neutral.sidebarBackground};
  }

  body {
    background-color: ${({ theme }) => theme.antdTheme?.colorBgBase};
  }
`;

export function ThemeProvider(props: Props) {
    const { theme: initialTheme, children, palette} = props;

    const { theme } = useTheme();
    const dark = (initialTheme ?? theme) === 'dark';

    const antdTheme = getANTDTheme({ dark, palette });
    const appTheme = _.merge({}, {
      ...getAppTheme({ dark: dark }),
        mode: initialTheme ?? theme,
        antdTheme: antdTheme.token,
    }, palette ?? {});

    return (
        <ANTDConfigProvider theme={antdTheme}>
            <StyledComponentsThemeProvider theme={appTheme}>
                <GlobalStyle />
                {children}
            </StyledComponentsThemeProvider>
        </ANTDConfigProvider>
    );
}
