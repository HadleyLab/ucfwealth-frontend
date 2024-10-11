import { t } from '@lingui/macro';
import { Button } from 'antd';
import { useEffect, useState } from 'react';

import { axiosInstance as axiosAidboxInstance } from 'aidbox-react/lib/services/instance';

import { QuestionnaireResponseForm } from '@beda.software/emr/components';
import { inMemorySaveService, questionnaireIdWOAssembleLoader } from '@beda.software/emr/hooks';
import { axiosInstance as axiosFHIRInstance, getToken } from '@beda.software/emr/services';

import { AuthLayout } from 'src/components/AuthLayout';

import { S } from './styles';
import { authorize } from '../SignIn';

interface Props {
    originPathName?: string;
}

export function SignUp(props: Props) {
    const [confirmEmail, setConfirmEmail] = useState(false);

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
        <AuthLayout>
            <S.Container>
                <S.Title>{t`Sign Up`}</S.Title>
                {confirmEmail ? (
                    <>
                        <S.Message>
                            {t`We have sent you email. Please click on the link in the email to complete registration`}
                        </S.Message>
                        <Button
                            type="primary"
                            onClick={() => authorize({ nextUrl: props.originPathName })}
                            size="large"
                        >
                            {t`Log in`}
                        </Button>
                    </>
                ) : (
                    <QuestionnaireResponseForm
                        questionnaireLoader={questionnaireIdWOAssembleLoader('patient-create')}
                        questionnaireResponseSaveService={inMemorySaveService}
                            onSuccess={() => {
                                setConfirmEmail(true);
                            }}
                        saveButtonTitle={t`Sign up`}
                        initialQuestionnaireResponse={{
                            id: 'sign-up',
                            resourceType: 'QuestionnaireResponse'
                        }}
                        FormFooterComponent={({ submitting, submitDisabled }) => (
                            <S.Buttons>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ flex: 1 }}
                                    size="large"
                                    disabled={submitting || submitDisabled}
                                >
                                    {t`Submit`}
                                </Button>
                                <Button
                                    type="primary"
                                    ghost
                                    onClick={() => authorize({ nextUrl: props.originPathName })}
                                    disabled={submitting}
                                    size="large"
                                    style={{ flex: 1 }}
                                >
                                    {t`Log in`}
                                </Button>
                            </S.Buttons>
                        )}
                    />
                )}
            </S.Container>
        </AuthLayout>
    );
}
