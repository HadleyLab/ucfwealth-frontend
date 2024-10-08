import { ConfigProvider as ANTDConfigProvider } from 'antd';
import { ReactNode } from 'react';
import { ThemeProvider as StyledComponentsThemeProvider, createGlobalStyle } from 'styled-components';

import { useTheme } from '@beda.software/emr/utils';

import { getAppTheme, getANTDTheme } from './';

interface Props {
    theme?: 'dark' | 'light';
    children: ReactNode;
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
    const { theme: initialTheme, children } = props;

    const { theme } = useTheme();
    const dark = (initialTheme ?? theme) === 'dark';

    const antdTheme = getANTDTheme({ dark: dark });
    const appTheme = {
        ...getAppTheme({ dark: dark }),
        mode: initialTheme ?? theme,
        antdTheme: antdTheme.token,
    };

    return (
        <ANTDConfigProvider theme={antdTheme}>
            <StyledComponentsThemeProvider theme={appTheme}>
                <GlobalStyle />
                {children}
            </StyledComponentsThemeProvider>
        </ANTDConfigProvider>
    );
}
