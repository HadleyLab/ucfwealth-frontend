import { Trans, t } from '@lingui/macro';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { axiosInstance as axiosAidboxInstance } from 'aidbox-react/lib/services/instance';

import { QuestionnaireResponseForm, Title } from '@beda.software/emr/components';
import { S } from '@beda.software/emr/dist/containers/SetPassword/SetPassword.styles';
import { inMemorySaveService, questionnaireIdLoader } from '@beda.software/emr/hooks';
import { axiosInstance as axiosFHIRInstance, getToken } from '@beda.software/emr/services';


export function SetPassword() {
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
        <S.Container>
            <S.Form>
                <Title level={4} style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Trans>Set password</Trans>
                </Title>
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
                />
            </S.Form>
        </S.Container>
    );
}
