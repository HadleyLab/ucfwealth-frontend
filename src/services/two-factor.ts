import { service } from 'aidbox-react/lib/services/service';

interface RequestTwoFactorData {
    transport?: string;
}

export function requestTwoFactor(data: RequestTwoFactorData) {
    return service<{ uri?: string }>({ method: 'POST', url: '/app/auth/two-factor/request', data });
}

interface ConfirmTwoFactorData {
    token: string;
}

export function confirmTwoFactor(data: ConfirmTwoFactorData) {
    return service({ method: 'POST', url: '/app/auth/two-factor/confirm', data });
}