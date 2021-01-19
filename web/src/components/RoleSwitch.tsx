import * as React from 'react';

import { User } from 'shared/src/contrib/aidbox';

import { SessionContext } from 'src/containers/SessionContext';
import {
    PatientUser,
    isPatient,
    isPractitioner,
    isSuperAdmin,
    isUnprivileged,
    PractitionerUser,
    SuperAdminUser,
    UserRole,
} from 'src/services/role';

interface Props {
    children: {
        [UserRole.SuperAdminRole]?: (props: { user: SuperAdminUser }) => React.ReactNode;
        [UserRole.PatientRole]?: (props: { user: PatientUser }) => React.ReactNode;
        [UserRole.PractitionerRole]?: (props: { user: PractitionerUser }) => React.ReactNode;
        [UserRole.UnprivilegedRole]?: (props: { user: User }) => React.ReactNode;
        default?: (props: { user: User }) => React.ReactNode;
    };
}

export class RoleSwitch extends React.Component<Props, {}> {
    public renderContent(user: User, role: UserRole) {
        const { children: mapping } = this.props;

        const defaultRenderFn = mapping.default ? mapping.default : () => <div />;

        if (isSuperAdmin(user) && role === UserRole.SuperAdminRole) {
            const renderFn = mapping[UserRole.SuperAdminRole] || defaultRenderFn;

            return renderFn({ user });
        } else if (isPatient(user) && role === UserRole.PatientRole) {
            const renderFn = mapping[UserRole.PatientRole] || defaultRenderFn;

            return renderFn({ user });
        } else if (isPractitioner(user) && role === UserRole.PractitionerRole) {
            const renderFn = mapping[UserRole.PractitionerRole] || defaultRenderFn;

            return renderFn({ user });
        } else if (isUnprivileged(user)) {
            const renderFn = mapping[UserRole.UnprivilegedRole] || defaultRenderFn;

            return renderFn({ user });
        } else {
            return defaultRenderFn({ user });
        }
    }

    public render() {
        return (
            <SessionContext.Consumer>
                {({ user, role }) => this.renderContent(user, role)}
            </SessionContext.Consumer>
        );
    }
}
