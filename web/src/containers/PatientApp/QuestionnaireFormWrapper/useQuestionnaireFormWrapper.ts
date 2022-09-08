import { useState } from 'react';

import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure, isSuccess } from 'aidbox-react/src/libs/remoteData';
import {
    extractBundleResources,
    getFHIRResources,
    saveFHIRResource,
} from 'aidbox-react/src/services/fhir';
import { mapSuccess, sequenceMap, service } from 'aidbox-react/src/services/service';

import { Patient } from 'shared/src/contrib/aidbox';

interface Props {
    patient: Patient;
}

export const useQuestionnaireFormWrapper = ({ patient }: Props) => {
    const [questionnaireSelected, setQuestionnaireSelected] = useState('');

    const [patientSettingsRD] = useService(async () => {
        const response = await getFHIRResources('PatientSettings', {
            patient: patient.id,
        });

        if (isFailure(response)) {
            console.log(response.status, response.error);
            return response;
        }

        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).PatientSettings[0] as any;
        });
    }, []);

    const [questionnaireResponseListRD] = useService(async () => {
        const response = await service({
            method: 'GET',
            url: `QuestionnaireResponse?_ilike=${patient && patient.id}`,
        });

        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).QuestionnaireResponse as any;
        });
    }, []);

    const settingsMapRD = sequenceMap({
        patientSettings: patientSettingsRD,
        questionnaireResponseList: questionnaireResponseListRD,
    });

    const questionnaireSelect = async (questionnaireId: string) => {
        const resource = {
            id: patient.id,
            patient: { id: patient.id, resourceType: 'Patient' },
            questionnaire: {
                id: questionnaireId,
                resourceType: 'Questionnaire',
            },
            resourceType: 'PatientSettings',
        };
        const response = await saveFHIRResource(resource);
        if (isSuccess(response)) setQuestionnaireSelected(questionnaireId);
    };

    return { settingsMapRD, questionnaireSelect, questionnaireSelected, setQuestionnaireSelected };
};
