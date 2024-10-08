import { t } from '@lingui/macro';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

import { getAuthorizeUrl, OAuthState } from '@beda.software/emr/services';

import { AuthLayout } from 'src/components/AuthLayout';

import { S } from './styles';

export function authorize(state?: OAuthState) {
    window.location.href = getAuthorizeUrl(state);
}

interface Props {
    originPathName?: string;
}

export function SignIn(props: Props) {
    const navigate = useNavigate();

    return (
        <AuthLayout>
            <S.Buttons>
                <Button
                    type="primary"
                    onClick={() => authorize({ nextUrl: props.originPathName })}
                    size="large"
                    style={{ flex: 1 }}
                >
                    {t`Log in`}
                </Button>
                <Button type="primary" ghost onClick={() => navigate('/signup')} style={{ flex: 1 }} size="large">
                    {t`Sign up`}
                </Button>
            </S.Buttons>
        </AuthLayout>
    );
}
