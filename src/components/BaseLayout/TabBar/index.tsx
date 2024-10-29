import { CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';

import { MenuIcon } from '@beda.software/emr/dist/icons/general/Menu';

import { S } from './TabBar.styles';
import logo from '../Sidebar/images/logo.svg';
import { SidebarBottom } from '../Sidebar/SidebarBottom';
import { SidebarTop } from '../Sidebar/SidebarTop';

export function AppTabBar() {
    const [menuOpened, toggleMenuOpened] = useState(false);

    return (
        <>
            <S.TabBar>
                <S.LogoWrapper to="/">
                    <S.Logo>
                        <img src={logo} />
                    </S.Logo>
                    <S.Name>UCF MammoChat</S.Name>
                </S.LogoWrapper>
                <S.Button icon={<MenuIcon />} type="text" onClick={() => toggleMenuOpened((v) => !v)} />
            </S.TabBar>
            <S.Drawer placement="right" onClose={() => toggleMenuOpened(false)} open={menuOpened} closable={false}>
                <S.CloseIcon type="text" icon={<CloseOutlined />} onClick={() => toggleMenuOpened(false)} />
                <SidebarTop collapsed={false} onItemClick={() => toggleMenuOpened(false)} />
                <SidebarBottom collapsed={false} onItemClick={() => toggleMenuOpened(false)} />
            </S.Drawer>
        </>
    );
}
