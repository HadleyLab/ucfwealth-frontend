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
            <S.Content>
                <p>
                    Welcome to <b>MammoChat</b>, a supportive community designed just for breast cancer patients like you.
                    Here, you can connect with others who understand your journey, access personalized information tailored to your unique needs,
                    and explore new treatment options with confidence.
                    Powered by advanced, transparent AI technology, MammoChat ensures you receive relevant,
                    trusted guidance every step of the way.
                    Join today to find support, gain insights, and empower yourself with the knowledge to make informed decisions about your care.
                    Let’s navigate this journey together.
                </p>
                <br />
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
                <S.ForgotPassword>
                    <Button type="link" onClick={() => navigate('/forgot-password')}>
                        {t`Forgot Password?`}
                    </Button>
                </S.ForgotPassword>
            </S.Content>
        </AuthLayout>
    );
}
