import { t } from '@lingui/macro';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { axiosInstance as axiosAidboxInstance } from 'aidbox-react/lib/services/instance';

import { QuestionnaireResponseForm } from '@beda.software/emr/components';
import { AppFooter } from '@beda.software/emr/dist/components/BaseLayout/Footer/index';
import s from '@beda.software/emr/dist/containers/SignIn/SignIn.module.scss';
import { S } from '@beda.software/emr/dist/containers/SignIn/SignIn.styles';
import logo from '@beda.software/emr/dist/images/logo.svg';
import { questionnaireIdLoader } from '@beda.software/emr/hooks';
import { axiosInstance as axiosFHIRInstance, getToken } from '@beda.software/emr/services';

export function SignUp() {
    const [confirmEmail, setConfirmEmail] = useState(false);
    const navigate = useNavigate();

    const appToken = getToken();
    const isAnonymousUser = !appToken;

    useEffect(() => {
        if (isAnonymousUser) {
            axiosFHIRInstance.defaults.headers.Authorization = `Basic ${window.btoa('anonymous:secret')}`;
            axiosAidboxInstance.defaults.headers.Authorization = `Basic ${window.btoa('anonymous:secret')}`;

            return;
        }

        return () => {
            if (isAnonymousUser) {
                axiosFHIRInstance.defaults.headers.Authorization = null;
                (axiosAidboxInstance.defaults.headers.Authorization as unknown) = undefined;
            }
        };
    }, [isAnonymousUser]);

    return (
        <S.Container>
            <S.Form>
                <div className={s.header}>
                    <S.Text>{t`Welcome to`}</S.Text>
                    <img src={logo} alt="" />
                </div>
                {confirmEmail ? (
                    <>
                        <S.Message>
                            <b>{t`Please, confirm your email`}</b>
                        </S.Message>
                        <Button
                            type="primary"
                            onClick={() => navigate('signin')}
                            size="large"
                        >
                            {t`Log in`}
                        </Button>
                    </>
                ) : (
                    <QuestionnaireResponseForm
                        questionnaireLoader={questionnaireIdLoader('patient-create')}
                        onSuccess={() => {
                            setConfirmEmail(true);
                        }}
                        saveButtonTitle={t`Sign up`}
                    />
                )}
            </S.Form>
            <AppFooter type="light" />
        </S.Container>
    );
}
