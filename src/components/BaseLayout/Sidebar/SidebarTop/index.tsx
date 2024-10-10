import { t } from '@lingui/macro';
import { Menu } from 'antd';
import classNames from 'classnames';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { EncountersIcon } from '@beda.software/emr/dist/icons/menu/EncountersIcon';
import { PatientsIcon } from '@beda.software/emr/dist/icons/menu/PatientsIcon';
import { PractitionersIcon } from '@beda.software/emr/dist/icons/menu/PractitionersIcon';
import { QuestionnairesIcon } from '@beda.software/emr/dist/icons/menu/QuestionnairesIcon';
import { getToken } from '@beda.software/emr/services';
import { matchCurrentUserRole, Role } from '@beda.software/emr/utils';

import logo from './images/logo.svg';
import s from './SidebarTop.module.scss';
import { S } from './SidebarTop.styles';

export interface RouteItem {
    path: string;
    exact?: boolean;
    label: string;
    icon?: React.ReactElement;
    disabled?: boolean;
    className?: string;
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    collapsed: boolean;
    onItemClick?: () => void;
}

export function SidebarTop(props: Props) {
    const location = useLocation();
    const appToken = getToken();
    const isAnonymousUser = !appToken;
    const { collapsed, onItemClick, ...other } = props;
    const navigate = useNavigate();

    const menuItems: RouteItem[] = !isAnonymousUser
        ? matchCurrentUserRole({
              [Role.Admin]: () => [
                  { label: t`Patients`, path: '/patients', icon: <PatientsIcon /> },
                  { label: t`Practitioners`, path: '/practitioners', icon: <PractitionersIcon /> },
                  { label: t`Questionnaires`, path: '/questionnaires', icon: <QuestionnairesIcon /> },
                  {
                      label: t`Community`,
                      path: `https://community.ucfwealth.app/auth/oauth2_basic`,
                      icon: <PatientsIcon />,
                  },
              ],
              [Role.Practitioner]: () => [
                  { label: t`Patients`, path: '/patients', icon: <PatientsIcon /> },
                  {
                      label: t`Community`,
                      path: `https://community.ucfwealth.app/auth/oauth2_basic`,
                      icon: <PatientsIcon />,
                  },
              ],
              [Role.Patient]: (patient) => [
                  { label: t`My Dashboard`, path: `/patients/${patient.id}`, icon: <EncountersIcon /> },
                  {
                      label: t`Community`,
                      path: `https://community.ucfwealth.app/auth/oauth2_basic`,
                      icon: <PatientsIcon />,
                  },
              ],
              [Role.Receptionist]: () => [
                  { label: t`Patients`, path: '/patients', icon: <PatientsIcon /> },
                  {
                      label: t`Community`,
                      path: `https://community.ucfwealth.app/auth/oauth2_basic`,
                      icon: <PatientsIcon />,
                  },
              ],
          })
        : [];

    const activeMenu = `/${location.pathname.split('/')[1]}`;
    const onMenuItemClick = (path: string) => {
        onItemClick?.();
        navigate(path);
    };

    return (
        <S.Container
            $collapsed={collapsed}
            className={classNames(s.container, {
                _collapsed: collapsed,
            })}
            {...other}
        >
            <Link to="/" className={s.logoWrapper}>
                <S.Logo>
                    <img src={logo} />
                </S.Logo>
                <S.Name className={s.logoCompanyName}>UCF MammoChat</S.Name>
            </Link>
            <S.Divider />
            <Menu
                mode="inline"
                theme="light"
                selectedKeys={[activeMenu!]}
                items={renderTopMenu(menuItems, onMenuItemClick)}
                className={s.menu}
                inlineCollapsed={collapsed}
            />
        </S.Container>
    );
}

function renderTopMenu(menuRoutes: RouteItem[], onItemClick: (path: string) => void) {
    return menuRoutes.map((route) => ({
        key: route.path,
        icon: route.icon,
        onClick: () => {
            if (route.path.startsWith('http')) {
                window.open(route.path, '_blank')?.focus();
            } else {
                onItemClick(route.path);
            }
        },
        label: (
            <div className={s.menuLink}>
                <span className={s.menuItemLabel}>{route.label}</span>
                <span className={classNames(s.menuItemLabel, s._small)}>{route.label}</span>
            </div>
        ),
        className: s.menuItem,
    }));
}
