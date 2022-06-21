import React from 'react';

import { RemoteData } from 'aidbox-react/src/libs/remoteData';

import { Patient, Questionnaire, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { QuestionnaireProgress } from 'src/components/QuestionnaireProgress';
import { Params, QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { RenderRemoteData } from 'src/components/RenderRemoteData';

import { useQuestionnaireForm } from './useQuestionnaireForm';

interface QuestionnaireResponseFormData {
    questionnaire: Questionnaire;
    questionnaireResponse: QuestionnaireResponse;
}

interface Props {
    patient: Patient;
    questionnaireId: string;
    setFormParams: (params: Params) => void;
    formParams: Params;
}

export const QuestionnaireForm = ({
    patient,
    questionnaireId,
    setFormParams,
    formParams,
}: Props) => {
    const { questFormRespRD, saveQR, setQiestionnaire, progress, choices, setChoices } =
        useQuestionnaireForm({
            patient,
            questionnaireId,
        });

    return (
        <div>
            <RenderRemoteData<QuestionnaireResponseFormData>
                remoteData={questFormRespRD as RemoteData<QuestionnaireResponseFormData, any>}
            >
                {(data) => {
                    setQiestionnaire(data.questionnaire.item);
                    return (
                        <QuestionnaireResponseForm
                            key={data.questionnaire.id}
                            questionnaire={data.questionnaire}
                            resource={data.questionnaireResponse}
                            onSave={saveQR as (resource: QuestionnaireResponse) => Promise<any>}
                            setFormParams={setFormParams}
                            formParams={formParams}
                            choices={choices}
                            setChoices={setChoices}
                        />
                    );
                }}
            </RenderRemoteData>
            {questionnaireId === 'screening-questions' && (
                <QuestionnaireProgress progress={progress} />
            )}
        </div>
    );
};
