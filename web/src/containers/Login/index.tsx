import { useEffect } from 'react';
import './styles.scss';
import { useLocation } from 'react-router-dom';

import { getAuthorizeUrl, OAuthState } from 'src/services/auth';

export function Login() {
    const location = useLocation<OAuthState>();
    useEffect(() => {
        window.location.href = getAuthorizeUrl(location.state);
    }, [location.state]);

    return null;
}
