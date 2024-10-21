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

export function ForgotPassword(props: Props) {
    const [formSubmitted, setFormSubmitted] = useState(false);

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
        <AuthLayout illustrationNumber={3}>
            <S.Container>
                <S.Title>{t`Forgot password`}</S.Title>
                {formSubmitted ? (
                    <>
                        <S.Message>
                            {t`We have sent you email. Please click on the link in the email to reset your password.`}
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
                    <>
                        <S.EntryMessage>{t`Please enter your email address. You will receive a link to create a new password via email.`}</S.EntryMessage>
                        <QuestionnaireResponseForm
                            questionnaireLoader={questionnaireIdWOAssembleLoader('forgot-password')}
                            questionnaireResponseSaveService={inMemorySaveService}
                            onSuccess={() => {
                                setFormSubmitted(true);
                            }}
                            saveButtonTitle={t`Sign up`}
                            initialQuestionnaireResponse={{
                                id: 'forgot-password',
                                resourceType: 'QuestionnaireResponse',
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
                                    {/* <Button
                                    type="primary"
                                    ghost
                                    onClick={() => authorize({ nextUrl: props.originPathName })}
                                    disabled={submitting}
                                    size="large"
                                    style={{ flex: 1 }}
                                >
                                    {t`Log in`}
                                </Button> */}
                                </S.Buttons>
                            )}
                        />
                        <S.Footer>
                            <S.FooterText>{t`Remember your password?`}</S.FooterText>
                            <Button type="link" onClick={() => authorize({ nextUrl: props.originPathName })}>
                                {t`Sign In`}
                            </Button>
                        </S.Footer>
                    </>
                )}
            </S.Container>
        </AuthLayout>
    );
}
