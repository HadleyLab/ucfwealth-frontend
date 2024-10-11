import { t } from '@lingui/macro';
import { Button } from 'antd';
import { useParams } from 'react-router-dom';


import { QuestionnaireResponseForm } from '@beda.software/emr/components';
import { inMemorySaveService, questionnaireIdWOAssembleLoader } from '@beda.software/emr/hooks';

import { AuthLayout } from 'src/components/AuthLayout';

import { S } from './styles';
import { authorize } from '../SignIn';

interface Props {
    originPathName?: string;
}

export function SetPassword(props: Props) {
    const { code } = useParams<{ code: string }>();

    return (
        <AuthLayout illustrationNumber={3}>
            <S.Container>
                <S.Title>{t`Set password`}</S.Title>
                <QuestionnaireResponseForm
                    questionnaireLoader={questionnaireIdWOAssembleLoader('set-password')}
                    questionnaireResponseSaveService={inMemorySaveService}
                    onSuccess={() => {
                        authorize({ nextUrl: props.originPathName })
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
