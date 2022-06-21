import React from 'react';

import { Patient } from 'shared/src/contrib/aidbox';

import { QuestionnaireSteps } from '../QuestionnaireSteps';

interface QuestionnaireFormWrapperProps {
    isSuccessQuestionnaire: boolean;
    setIsSuccessQuestionnaire: (state: boolean) => void;
    patient: Patient;
}

export const QuestionnaireFormWrapper = ({
    isSuccessQuestionnaire,
    setIsSuccessQuestionnaire,
    patient,
}: QuestionnaireFormWrapperProps) => {
    return (
        <QuestionnaireSteps
            isSuccessQuestionnaire={isSuccessQuestionnaire}
            patient={patient}
            setIsSuccessQuestionnaire={setIsSuccessQuestionnaire}
        />
    );
};
