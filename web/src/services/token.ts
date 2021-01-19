import { Token } from 'aidbox-react/src/services/token';

export function saveToken(token: Token): void {
    window.localStorage.setItem('token', JSON.stringify(token));
}

export function removeToken(): void {
    window.localStorage.removeItem('token');
}

export function retrieveToken(): Token | undefined {
    const token = window.localStorage.getItem('token');
    if (token) {
        return JSON.parse(token);
    }

    return undefined;
}
