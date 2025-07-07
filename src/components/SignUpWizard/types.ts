import { Patient, Questionnaire, QuestionnaireResponse } from 'fhir/r4b';

export interface SignUpWizardProps {
    patient: Patient;
    questionnaires: Questionnaire[];
    notFinishedQuestionnaires: Questionnaire[];
    questionnaireResponses: QuestionnaireResponse[];
    show: boolean;
    onSuccess: () => void;
    onStepSuccess: () => void;
}
