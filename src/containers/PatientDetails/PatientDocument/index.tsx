import { Organization, ParametersParameter, Patient, Practitioner, QuestionnaireResponse } from 'fhir/r4b';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ItemControlGroupItemComponentMapping } from 'sdc-qrf/lib/types';

import { BaseQuestionnaireResponseForm, Spinner } from '@beda.software/emr/components';
import {
    AnxietyScore,
    DepressionScore,
} from '@beda.software/emr/dist/components/BaseQuestionnaireResponseForm/readonly-widgets/score';
import { S } from '@beda.software/emr/dist/containers/PatientDetails/PatientDocument/PatientDocument.styles';
import { PatientDocumentHeader } from '@beda.software/emr/dist/containers/PatientDetails/PatientDocument/PatientDocumentHeader/index';
import { usePatientDocument } from '@beda.software/emr/dist/containers/PatientDetails/PatientDocument/usePatientDocument';
import { usePatientHeaderLocationTitle } from '@beda.software/emr/dist/containers/PatientDetails/PatientHeader/hooks';
import { RenderRemoteData, WithId } from '@beda.software/fhir-react';
import { RemoteData, isSuccess, notAsked } from '@beda.software/remote-data';

import { Wizzard } from 'src/components/Wizzard';

import s from './PatientDocument.module.scss';

export interface PatientDocumentProps {
    patient: Patient;
    author: WithId<Practitioner | Patient | Organization>;
    questionnaireResponse?: WithId<QuestionnaireResponse>;
    launchContextParameters?: ParametersParameter[];
    questionnaireId?: string;
    encounterId?: string;
    onSuccess?: () => void;
}

export function PatientDocument(props: PatientDocumentProps) {
    const params = useParams<{ questionnaireId: string; encounterId?: string }>();
    const encounterId = props.encounterId || params.encounterId;
    const questionnaireId = props.questionnaireId || params.questionnaireId!;
    const { response } = usePatientDocument({
        ...props,
        questionnaireId,
        encounterId,
    });
    const navigate = useNavigate();

    const [draftSaveResponse, setDraftSaveResponse] = useState<RemoteData<QuestionnaireResponse>>(notAsked);

    const { savedMessage } = useSavedMessage(draftSaveResponse);

    usePatientHeaderLocationTitle({
        title: isSuccess(response) ? (response.data.formData.context.questionnaire?.name ?? '') : '',
    });

    return (
        <div className={s.container}>
            <S.Content>
                <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                    {({ formData, onSubmit, provenance }) => (
                        <>
                            <PatientDocumentHeader
                                formData={formData}
                                questionnaireId={questionnaireId}
                                draftSaveResponse={draftSaveResponse}
                                savedMessage={savedMessage}
                            />

                            <BaseQuestionnaireResponseForm
                                formData={formData}
                                onSubmit={onSubmit}
                                itemControlQuestionItemComponents={{
                                    'anxiety-score': AnxietyScore,
                                    'depression-score': DepressionScore,
                                }}
                                onCancel={() => navigate(-1)}
                                saveButtonTitle={'Complete'}
                                autoSave={!provenance}
                                draftSaveResponse={draftSaveResponse}
                                setDraftSaveResponse={setDraftSaveResponse}
                            />
                        </>
                    )}
                </RenderRemoteData>
            </S.Content>
        </div>
    );
}

function useSavedMessage(draftSaveResponse: RemoteData) {
    const [savedMessage, setSavedMessage] = useState('');

    useEffect(() => {
        if (isSuccess(draftSaveResponse)) {
            setSavedMessage('Saved');

            const timeoutId = setTimeout(() => {
                setSavedMessage('');
            }, 2500);
            return () => clearTimeout(timeoutId);
        }
    }, [draftSaveResponse]);
    return { savedMessage };
}
