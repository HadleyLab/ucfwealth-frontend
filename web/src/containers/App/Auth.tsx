import queryString from 'query-string';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Token } from 'aidbox-react/src/services/token';

import { parseOAuthState } from 'src/services/auth';

interface Props {
    setToken: (token: Token) => void;
}

export function Auth({ setToken }: Props) {
    const location = useLocation();

    useEffect(() => {
        const queryParams = queryString.parse(location.hash);
        if (queryParams.access_token) {
            setToken({ access_token: queryParams.access_token as string, token_type: 'Bearer' });
            const state = parseOAuthState(queryParams.state as string | undefined);

            window.location.href = state.nextUrl ?? '/';
        }
    }, [location.hash, setToken]);

    return null;
}
