import { Layout } from 'antd';
import classNames from 'classnames';
import { ReactNode } from 'react';

import s from '@beda.software/emr/dist/components/BaseLayout/BaseLayout.module.scss';
import { S } from '@beda.software/emr/dist/components/BaseLayout/BaseLayout.styles';

import { ThemeProvider } from 'src/theme';

import { AppSidebar } from './Sidebar';
import { AppTabBar } from './TabBar';

interface Props {
    children: ReactNode;
    style?: React.CSSProperties;
}

export function BaseLayout({ children, style }: Props) {
    return (
        <S.Container style={style}>
            <AppSidebar />
            <AppTabBar />
            <Layout className={s.content}>{children}</Layout>
        </S.Container>
    );
}

export function AnonymousLayout({ children, style }: Props) {
    return (
        <S.Container style={style}>
            <AppSidebar />
            <Layout className={s.content}>{children}</Layout>
        </S.Container>
    );
}

export function BasePageHeader(props: React.HTMLAttributes<HTMLDivElement>) {
    const { className, ...rest } = props;

    return (
        <ThemeProvider
            palette={
                {
                    primaryPalette: {
                        bcp_1: '#000',
                    },
                    neutral: {
                        primaryText: '#fff',
                    },
                } as any
            }
        >
            <S.PageWrapper>
                <div className={classNames(s.pageHeader, className)} {...rest} />
            </S.PageWrapper>
        </ThemeProvider>
    );
}

export function BasePageContent(props: React.HTMLAttributes<HTMLDivElement>) {
    const { className, ...rest } = props;

    return (
        <div className={s.pageContentWrapper}>
            <div className={classNames(s.pageContent, className)} {...rest} />
        </div>
    );
}
