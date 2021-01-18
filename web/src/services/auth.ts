import * as _ from 'lodash';
import { RemoteDataResult } from 'aidbox-react/lib/libs/remoteData';
import { service } from 'aidbox-react/lib/services/service';
import { Token } from 'aidbox-react/lib/services/token';

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

export function googleSignin(code: string): Promise<RemoteDataResult<Token>> {
    return service({
        url: '/auth/token',
        method: 'POST',
        data: {
            client_id: 'google-client',
            grant_type: 'authorization_code',
            code,
        },
    });
}

export interface SignupBody {
    email: string;
}

export function signup(data: SignupBody): Promise<RemoteDataResult<any>> {
    const formData = new FormData();
    formData.append('username', data.email);
    _.each(['email'], (key) => formData.append(key, data[key] || ''));

    return service({
        url: '/auth/signup',
        method: 'POST',
        data: formData,
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
