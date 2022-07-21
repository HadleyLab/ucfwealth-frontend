import {
    DoubleRightOutlined,
    DownOutlined,
    PoweroffOutlined,
    UserOutlined,
} from '@ant-design/icons/lib';
import { Layout, Menu, Dropdown, Button } from 'antd';
import _ from 'lodash';
import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { SessionContext } from 'src/containers/SessionContext';
import { Logo } from 'src/images/Logo';

const { Header, Content } = Layout;

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
    setIsSuccessQuestionnaire?: (state: boolean) => void;
    disableMenu?: boolean;
    footerStyle?: React.CSSProperties;
}

export function BaseLayout(props: BaseLayoutProps) {
    const { routes: routeList, children, setIsSuccessQuestionnaire } = props;
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
                        <Link
                            to={route.path}
                            onClick={() => {
                                if (setIsSuccessQuestionnaire) {
                                    setIsSuccessQuestionnaire(false);
                                }
                            }}
                        >
                            {renderMenuTitle(route)}
                        </Link>
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

    const [selectedKeys, setSelectedKeys] = useState([history.location.pathname]);

    const location = history.location.pathname;

    useEffect(() => {
        setSelectedKeys([location]);
    }, [location]);

    const menuWidth = routeList!.length > 2 ? '740px' : '300px';

    return (
        <>
            <Layout style={baseLayoutStyle}>
                <Header>
                    <Logo />
                    <div style={{ display: 'flex' }}>
                        {!props.disableMenu && routeList && (
                            <Menu
                                mode="horizontal"
                                onClick={() => {
                                    setSelectedKeys([history.location.pathname]);
                                }}
                                selectedKeys={selectedKeys}
                                style={{ minWidth: menuWidth, height: '65px' }}
                                disabledOverflow={true}
                            >
                                {renderMenu(routeList)}
                            </Menu>
                        )}
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
                                                <PoweroffOutlined /> Logout
                                            </Menu.Item>
                                        </Menu>
                                    }
                                >
                                    <Button type="link">
                                        <span
                                            style={{
                                                color: 'white',
                                                fontSize: '13px',
                                                fontWeight: 500,
                                            }}
                                        >
                                            {user.email} ({role})
                                        </span>
                                        <DownOutlined />
                                    </Button>
                                </Dropdown>
                            </div>
                        )}
                    </div>
                </Header>
                <Layout>
                    <Content style={contentStyle}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                minWidth: '840px',
                            }}
                        >
                            {children}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}

const userOutlinedStyle = { color: '#000000' };

const baseLayoutStyle = {
    minHeight: 'calc(100vh - 70px)',
};

const contentStyle = {
    dispaly: 'flex',
    alignSelf: 'center',
    background: '#fff',
    padding: '24px 40px',
    minHeight: 'calc(100vh - 66px)',
    minWidth: '1200px',
};
