import _ from 'lodash';
import {User} from "shared/contrib/aidbox";


interface Role<P extends keyof User['data']> extends User {
    data: User['data'] & Required<Pick<User['data'], P>>;
}

export type SuperAdminUser = Role<'superAdmin'>;
export type PatientUser = Role<'patient'>;
export type PractitionerUser = Role<'practitioner'>;

export function isSuperAdmin(user: User): user is SuperAdminUser {
    // TODO: create a separated superadmin user
    return (
        (_.isPlainObject(user.data) && user?.userType === 'superAdmin' && _.isPlainObject(user.data!.superAdmin)) ||
        user.id === 'admin'
    );
}

export function isAdmin(user: User): user is PatientUser {
    return _.isPlainObject(user.data) && user?.userType === 'admin' && _.isPlainObject(user.data!.admin);
}

export function isPractitioner(user: User): user is PractitionerUser {
    return _.isPlainObject(user.data) && user?.userType === 'practitioner' && _.isPlainObject(user.data!.practitioner);
}

export function isUnprivileged(user: User) {
    return !_.some([isSuperAdmin, isAdmin, isPractitioner], (fn) => fn(user)) && user.id !== 'admin';
}

export enum UserRole {
    SuperAdminRole = 'Super Admin',
    PatientRole = 'Patient',
    PractitionerRole = 'Practitioner',
    UnprivilegedRole = 'Unprivileged',
}

export const userRoles = [
    UserRole.SuperAdminRole,
    UserRole.PatientRole,
    UserRole.PractitionerRole,
    UserRole.UnprivilegedRole,
];

export function getUserRole(user: User) {
    if (isSuperAdmin(user)) {
        return UserRole.SuperAdminRole;
    } else if (isAdmin(user)) {
        return UserRole.PatientRole;
    } else if (isPractitioner(user)) {
        return UserRole.PractitionerRole;
    } else {
        return UserRole.UnprivilegedRole;
    }
}

const mapping = {
    [UserRole.SuperAdminRole]: 'superAdmin',
    [UserRole.PatientRole]: 'patient',
    [UserRole.PractitionerRole]: 'practitioner',
    [UserRole.UnprivilegedRole]: '',
};

export function getUserRoleDataKey(userRole: UserRole) {
    return mapping[userRole];
}
