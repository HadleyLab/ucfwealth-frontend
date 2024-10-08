import { t } from '@lingui/macro';
import { Button } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { axiosInstance as axiosAidboxInstance } from 'aidbox-react/lib/services/instance';

import { QuestionnaireResponseForm } from '@beda.software/emr/components';
import { inMemorySaveService, questionnaireIdLoader } from '@beda.software/emr/hooks';
import { axiosInstance as axiosFHIRInstance, getToken } from '@beda.software/emr/services';

import { AuthLayout } from 'src/components/AuthLayout';

import { S } from './styles';
import { authorize } from '../SignIn';

interface Props {
    originPathName?: string;
}

export function SetPassword(props: Props) {
    const { code } = useParams<{ code: string }>();

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
                <S.Title>{t`Set password`}</S.Title>
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdLoader('set-password')}
                    questionnaireResponseSaveService={inMemorySaveService}
                    onSuccess={() => {
                        window.location.href = '/';
                    }}
                    saveButtonTitle={t`Save`}
                    initialQuestionnaireResponse={{
                        id: 'reset-password',
                        resourceType: 'QuestionnaireResponse',
                        item: [
                            {
                                answer: [
                                    {
                                        valueString: code,
                                    },
                                ],
                                linkId: 'token',
                            },
                        ],
                    }}
                    FormFooterComponent={({ submitting, submitDisabled }) => (
                        <S.Buttons>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ flex: 1 }}
                                size="large"
                                disabled={submitting || submitDisabled}
                                onClick={() => authorize({ nextUrl: props.originPathName })}
                            >
                                {t`Submit`}
                            </Button>
                        </S.Buttons>
                    )}
                />
            </S.Container>
        </AuthLayout>
    );
}
