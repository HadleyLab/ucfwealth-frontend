import { Patient, QuestionnaireResponse } from 'fhir/r4b';

import { Questionnaire } from '@beda.software/aidbox-types';
import { getFHIRResources } from '@beda.software/emr/services';
import { useService, extractBundleResources } from '@beda.software/fhir-react';
import { isSuccess, success } from '@beda.software/remote-data';

export interface RequiredFormsWidgetData {
    questionnaire: Questionnaire;
    questionnaireResponse: QuestionnaireResponse | undefined;
}

export function useRequiredFormsWidget(patient: Patient) {
    const questionnairesOrder = [
        'patient-informed-consent',
        'authorization-for-release-of-medical-images',
        'breast-cancer-study-survey',
    ];

    const [response] = useService(async () => {
        const qResponse = await getFHIRResources<Questionnaire>('Questionnaire', {
            id: questionnairesOrder.join(','),
        });

        if (isSuccess(qResponse)) {
            const questionnaires = extractBundleResources(qResponse.data).Questionnaire;

            const qrResponse = await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
                questionnaire: questionnairesOrder.join(','),
                subject: `Patient/${patient.id}`,
            });

            if (isSuccess(qrResponse)) {
                const questionnaireResponses = extractBundleResources(qrResponse.data).QuestionnaireResponse;
                const result: RequiredFormsWidgetData[] = questionnairesOrder.map((qId) => ({
                    questionnaire: questionnaires.find((q) => q.id === qId)!,
                    questionnaireResponse: questionnaireResponses.find((qr) => qr.questionnaire === qId),
                }));

                return success(result);
            }

            return qrResponse;
        }

        return qResponse;
    });

    return { response };
}
