import { RemoteData } from 'aidbox-react/src/libs/remoteData';

import { Patient, Questionnaire, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { RenderRemoteData } from 'src/components/RenderRemoteData';

import { useQuestionnaireForm } from './useQuestionnaireForm';

interface QuestionnaireResponseFormData {
    questionnaire: Questionnaire;
    questionnaireResponse: QuestionnaireResponse;
}

interface Props {
    patient: Patient;
    questionnaireId: string;
    currentStep: number;
    setCurrentStep: (value: React.SetStateAction<number>) => void;
}

export const QuestionnaireForm = ({
    patient,
    questionnaireId,
    currentStep,
    setCurrentStep,
}: Props) => {
    const { questFormRespRD, progress, choices, saveQR, setChoices } =
        useQuestionnaireForm({
            patient,
            questionnaireId,
        });

    return (
        <div style={{ width: '840px' }}>
            <RenderRemoteData<QuestionnaireResponseFormData>
                remoteData={questFormRespRD as RemoteData<QuestionnaireResponseFormData, any>}
            >
                {(data) => {
                    return (
                        <QuestionnaireResponseForm
                            key={data.questionnaire.id}
                            questionnaire={data.questionnaire}
                            resource={data.questionnaireResponse}
                            choices={choices}
                            currentStep={currentStep}
                            questionnaireId={questionnaireId}
                            progress={progress}
                            onSave={saveQR as (resource: QuestionnaireResponse) => Promise<any>}
                            setChoices={setChoices}
                            setCurrentStep={setCurrentStep}
                        />
                    );
                }}
            </RenderRemoteData>
        </div>
    );
};
