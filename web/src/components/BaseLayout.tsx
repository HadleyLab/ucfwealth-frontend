import {
    DoubleRightOutlined,
    DownOutlined,
    PoweroffOutlined,
    UserOutlined,
} from '@ant-design/icons/lib';
import { Layout, Menu, Dropdown, Button } from 'antd';
import * as _ from 'lodash';
import * as React from 'react';
import { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { SessionContext } from 'src/containers/SessionContext';

const { Header, Content, Sider, Footer } = Layout;

interface RouteItem {
    url?: string;
    path?: string;
    exact?: boolean;
    title: string;
    submenu?: RouteItem[];
    icon?: React.ReactNode;
}

interface BaseLayoutProps {
    routes?: RouteItem[];
    children: any;
}

export function BaseLayout(props: BaseLayoutProps) {
    const { routes: routeList, children } = props;
    const { user, role, logout } = useContext(SessionContext);
    let history = useHistory();

    function renderMenuTitle(routeItem: RouteItem) {
        return (
            <span>
                {routeItem.icon ? routeItem.icon : <DoubleRightOutlined />}
                <span>{routeItem.title}</span>
            </span>
        );
    }

    function renderMenu(routes: RouteItem[]) {
        return _.map(routes, (route) => {
            if (route.submenu) {
                return (
                    <Menu.SubMenu title={renderMenuTitle(route)} key={route.path || route.title}>
                        {renderMenu(route.submenu)}
                    </Menu.SubMenu>
                );
            }

            if (route.path) {
                return (
                    <Menu.Item key={route.path}>
                        <Link to={route.path}>{renderMenuTitle(route)}</Link>
                    </Menu.Item>
                );
            }

            if (route.url) {
                return (
                    <Menu.Item key={route.path}>
                        <Link
                            to={{ pathname: route.url }}
                            target="_blank"
                            onClick={() => history.push('/app/questionnaire')}
                        >
                            {renderMenuTitle(route)}
                        </Link>
                    </Menu.Item>
                );
            }

            console.error('Route item should have either path or submenu');

            return null;
        });
    }

    function getActiveKeys(routes: RouteItem[]): RouteItem[] {
        return _.filter(routes, ({ path, submenu }) => {
            if (path) {
                return (
                    history.location.pathname === path ||
                    history.location.pathname.startsWith(`${path}/`)
                );
            }

            if (submenu) {
                return _.some(submenu, getActiveKeys(submenu));
            }

            return false;
        });
    }

    return (
        <>
            <Layout className={'baseLayout'}>
                <Header>
                    <a href="/app">
                        <h2 style={{ color: 'white' }}>Covidimaging</h2>
                    </a>
                    {user && (
                        <div className="userpanel__wrapper">
                            <Button
                                shape="circle"
                                icon={<UserOutlined style={userOutlinedStyle} />}
                            />
                            <Dropdown
                                className="userpanel__dropdown"
                                trigger={['click']}
                                overlay={
                                    <Menu>
                                        <Menu.Item
                                            key="logout"
                                            onClick={async () => {
                                                await logout();
                                                history.push('/');
                                            }}
                                        >
                                            <PoweroffOutlined />
                                            Logout
                                        </Menu.Item>
                                    </Menu>
                                }
                            >
                                <Button type="link">
                                    <span style={{ color: 'white' }}>
                                        {user.email} ({role})
                                    </span>
                                    <DownOutlined />
                                </Button>
                            </Dropdown>
                        </div>
                    )}
                </Header>
                <Layout>
                    <Sider theme="light">
                        {routeList && (
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={_.map(
                                    getActiveKeys(routeList),
                                    ({ path, title }) => path || title,
                                )}
                                selectedKeys={[window.location.pathname]}
                                style={{ lineHeight: '64px', borderRight: '1px solid #fff' }}
                            >
                                {renderMenu(routeList)}
                            </Menu>
                        )}
                    </Sider>
                    <Content>
                        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                            {children}
                        </div>
                    </Content>
                </Layout>
            </Layout>
            <Footer>
                <div>Covidimaging</div>
            </Footer>
        </>
    );
}

const userOutlinedStyle = { color: '#000000', backgroundColor: '#eab800' };
