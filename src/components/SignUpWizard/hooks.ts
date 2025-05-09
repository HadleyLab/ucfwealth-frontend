import { Questionnaire, QuestionnaireResponse, Patient, Consent } from 'fhir/r4b';
import { compact } from 'lodash';

import { getFHIRResources } from '@beda.software/emr/services';
import { extractBundleResources, useService } from '@beda.software/fhir-react';
import { mapSuccess, resolveMap } from '@beda.software/remote-data';

export function useSignUpWizard(patient: Patient) {
    const [response] = useService(async () => {
        const questionnaireIDs = ['patient-informed-consent', 'authorization-for-release-of-medical-images', 'breast-cancer-study-survey'];

        return mapSuccess(
            await resolveMap({
                consentBundle: getFHIRResources<Consent>('Consent', {
                    category: 'npp',
                    patient: `Patient/${patient.id}`,
                }),
                questionnaireBundle: getFHIRResources<Questionnaire>('Questionnaire', {
                    _id: questionnaireIDs.join(','),
                    _elements: 'id,title',
                }),
                questionnaireResponseBundle: getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
                    subject: patient?.id,
                    questionnaire: questionnaireIDs.join(','),
                }),
            }),
            ({ consentBundle, questionnaireBundle, questionnaireResponseBundle }) => {
                const consent = extractBundleResources<Consent>(consentBundle).Consent[0];
                const questionnaireResponses =
                    extractBundleResources(questionnaireResponseBundle).QuestionnaireResponse;
                const questionnaires = extractBundleResources(questionnaireBundle).Questionnaire;

                const finishedQuestionnaireIds = compact(questionnaireResponses.map((qr) => qr.questionnaire));
                const questionnairesInOrder = compact(
                    questionnaireIDs.map((qId) => questionnaires.find((q) => q.id === qId)),
                );
                const notFinishedQuestionnaires = questionnairesInOrder.filter(
                    (q) => !finishedQuestionnaireIds.includes(q.id),
                );
                const showWizard = notFinishedQuestionnaires.length > 0 || !consent;

                return {
                    questionnaires: questionnairesInOrder,
                    notFinishedQuestionnaires,
                    questionnaireResponses,
                    consent,
                    showWizard
                };
            },
        );
    });

    return { response };
}
