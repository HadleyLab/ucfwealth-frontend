import { Layout } from 'antd';
import classNames from 'classnames';
import { ReactNode } from 'react';

import s from '@beda.software/emr/dist/components/BaseLayout/BaseLayout.module.scss';
import { S } from '@beda.software/emr/dist/components/BaseLayout/BaseLayout.styles';
import { AppTabBar } from '@beda.software/emr/dist/components/BaseLayout/TabBar/index';

import { AppFooter } from './Footer';
import { AppSidebar } from './Sidebar';

interface Props {
    children: ReactNode;
    style?: React.CSSProperties;
}

export function BaseLayout({ children, style }: Props) {
    return (
        <S.Container style={style}>
            <AppSidebar />
            <AppTabBar />
            <Layout className={s.content}>
                {children}
                <AppFooter />
            </Layout>
        </S.Container>
    );
}

export function AnonymousLayout({ children, style }: Props) {
    return (
        <S.Container style={style}>
            <AppSidebar />
            <Layout className={s.content}>
                {children}
                <AppFooter />
            </Layout>
        </S.Container>
    );
}

export function BasePageHeader(props: React.HTMLAttributes<HTMLDivElement>) {
    const { className, ...rest } = props;

    return (
        <S.PageWrapper>
            <div className={classNames(s.pageHeader, className)} {...rest} />
        </S.PageWrapper>
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
