import { Patient, QuestionnaireResponse } from 'fhir/r4b';

import { Questionnaire } from '@beda.software/aidbox-types';
import { getFHIRResources } from '@beda.software/emr/services';
import { useService, extractBundleResources } from '@beda.software/fhir-react';
import { isSuccess, success } from '@beda.software/remote-data';

export interface MedicalImagesAuthorizationWidgetData {
    questionnaire: Questionnaire;
    questionnaireResponse: QuestionnaireResponse[];
}

export function useMedicalImagesAuthorizationWidget(patient: Patient) {
    const questionnairesId = 'authorization-for-release-of-medical-images';

    const [response] = useService(async () => {
        const qResponse = await getFHIRResources<Questionnaire>('Questionnaire', {
            id: questionnairesId,
        });

        if (isSuccess(qResponse)) {
            const questionnaires = extractBundleResources(qResponse.data).Questionnaire;

            const qrResponse = await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
                questionnaire: questionnairesId,
                subject: `Patient/${patient.id}`,
            });

            if (isSuccess(qrResponse)) {
                const questionnaireResponses = extractBundleResources(qrResponse.data).QuestionnaireResponse;
                const result: MedicalImagesAuthorizationWidgetData = {
                    questionnaire: questionnaires[0],
                    questionnaireResponse: questionnaireResponses,
                }

                return success(result);
            }

            return qrResponse;
        }

        return qResponse;
    });

    return { response };
}
