import { t } from '@lingui/macro';
import { Menu } from 'antd';
import classNames from 'classnames';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import s from '@beda.software/emr/dist/components/BaseLayout/Sidebar/SidebarTop/SidebarTop.module.scss';
import { S } from '@beda.software/emr/dist/components/BaseLayout/Sidebar/SidebarTop/SidebarTop.styles';
import { CompanyName } from '@beda.software/emr/dist/icons/brand/CompanyName';
import { LogoSmall } from '@beda.software/emr/dist/icons/brand/LogoSmall';
import { EncountersIcon } from '@beda.software/emr/dist/icons/menu/EncountersIcon';
import { InvoicesIcon } from '@beda.software/emr/dist/icons/menu/InvoicesIcon';
import { MedicationsIcon } from '@beda.software/emr/dist/icons/menu/MedicationsIcon';
import { PatientsIcon } from '@beda.software/emr/dist/icons/menu/PatientsIcon';
import { PractitionersIcon } from '@beda.software/emr/dist/icons/menu/PractitionersIcon';
import { PrescriptionsIcon } from '@beda.software/emr/dist/icons/menu/PrescriptionsIcon';
import { QuestionnairesIcon } from '@beda.software/emr/dist/icons/menu/QuestionnairesIcon';
import { ServicesIcon } from '@beda.software/emr/dist/icons/menu/ServicesIcon';
import { getToken } from '@beda.software/emr/services';
import { matchCurrentUserRole, Role } from '@beda.software/emr/utils';

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
                  { label: t`Invoices`, path: '/invoices', icon: <InvoicesIcon /> },
                  { label: t`Services`, path: '/healthcare-services', icon: <ServicesIcon /> },
                  { label: t`Encounters`, path: '/encounters', icon: <EncountersIcon /> },
                  { label: t`Patients`, path: '/patients', icon: <PatientsIcon /> },
                  { label: t`Practitioners`, path: '/practitioners', icon: <PractitionersIcon /> },
                  { label: t`Questionnaires`, path: '/questionnaires', icon: <QuestionnairesIcon /> },
              ],
              [Role.Practitioner]: () => [
                  { label: t`Encounters`, path: '/encounters', icon: <EncountersIcon /> },
                  { label: t`Patients`, path: '/patients', icon: <PatientsIcon /> },
                  { label: t`Questionnaires`, path: '/questionnaires', icon: <QuestionnairesIcon /> },
              ],
              [Role.Patient]: (patient) => [
                  { label: t`My Dashboard`, path: `/patients/${patient.id}`, icon: <EncountersIcon /> },
                  { label: t`Community`, path: `/patients/${patient.id}`, icon: <PatientsIcon /> },
              ],
              [Role.Receptionist]: () => [
                  { label: t`Scheduling`, path: '/scheduling', icon: <EncountersIcon /> },
                  { label: t`Invoices`, path: '/invoices', icon: <InvoicesIcon /> },
                  { label: t`Medications`, path: '/medications', icon: <MedicationsIcon /> },
                  { label: t`Prescriptions`, path: '/prescriptions', icon: <PrescriptionsIcon /> },
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
                <LogoSmall style={{ minWidth: 32 }} />
                <CompanyName className={s.logoCompanyName} style={{ minWidth: 89 }} />
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
        onClick: () => onItemClick(route.path),
        label: (
            <div className={s.menuLink}>
                <span className={s.menuItemLabel}>{route.label}</span>
                <span className={classNames(s.menuItemLabel, s._small)}>{route.label}</span>
            </div>
        ),
        className: s.menuItem,
    }));
}
