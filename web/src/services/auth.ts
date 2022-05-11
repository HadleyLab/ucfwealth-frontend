import { RemoteDataResult } from 'aidbox-react/src/libs/remoteData';
import { service } from 'aidbox-react/src/services/service';
import { Token } from 'aidbox-react/src/services/token';

import config from 'shared/src/config';

export interface SigninBody {
    email: string;
    password: string;
}

export function signin(data: SigninBody): Promise<RemoteDataResult<Token>> {
    return service({
        url: '/auth/token',
        method: 'POST',
        data: {
            username: data.email,
            password: data.password,
            client_id: 'SPA',
            client_secret: '123456',
            grant_type: 'password',
        },
    });
}

export interface SignupBody {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate?: string;
    gender?: string;
    ssn?: string;
}

export function signup(data: SignupBody): Promise<RemoteDataResult<any>> {
    return service({
        url: '/auth/$register',
        method: 'POST',
        data: data,
    });
}

export interface ResetPasswordBody {
    email: string;
}

export function resetPassword(body: ResetPasswordBody): Promise<RemoteDataResult<any>> {
    return service({
        url: `/auth/reset-password`,
        method: 'POST',
        data: body,
    });
}

export interface SetPasswordBody {
    code: string;
    password: string;
}

export function confirm({ code, password }: SetPasswordBody): Promise<RemoteDataResult<any>> {
    const data = new FormData();
    data.append('password', password);

    return service({
        url: `/auth/signup/confirm/${code}`,
        method: 'POST',
        data,
    });
}

export function setPassword(body: SetPasswordBody): Promise<RemoteDataResult<any>> {
    return service({
        url: `/auth/set-password`,
        method: 'POST',
        data: body,
    });
}

export function getUserInfo(): Promise<RemoteDataResult<any>> {
    return service({
        method: 'GET',
        url: '/auth/userinfo',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
}

export interface OAuthState {
    nextUrl?: string;
}

export function parseOAuthState(state?: string): OAuthState {
    try {
        return state ? JSON.parse(atob(state)) : {};
    } catch {}

    return {};
}

export function formatOAuthState(state: OAuthState) {
    return btoa(JSON.stringify(state));
}

export function getAuthorizeUrl(state?: OAuthState) {
    return `${config.baseURL}/auth/authorize${makeWebAuthSearchParams(state)}`;
}

export function makeWebAuthSearchParams(state?: OAuthState) {
    const stateStr = state ? `&state=${formatOAuthState(state)}` : '';

    return `?client_id=${config.clientId}&response_type=token${stateStr}`;
}
