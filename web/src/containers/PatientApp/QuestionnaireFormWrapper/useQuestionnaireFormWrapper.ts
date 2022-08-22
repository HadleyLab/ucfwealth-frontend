import { useState } from 'react';

import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure } from 'aidbox-react/src/libs/remoteData';
import { extractBundleResources } from 'aidbox-react/src/services/fhir';
import { mapSuccess, sequenceMap, service } from 'aidbox-react/src/services/service';

import { Patient } from 'shared/src/contrib/aidbox';

interface Props {
    patient: Patient;
}

export const useQuestionnaireFormWrapper = ({ patient }: Props) => {
    const [questionnaireSelected, setQuestionnaireSelected] = useState('');

    const [activeQuestionnaireMapRD] = useService(async () => {
        const response = await service({
            method: 'GET',
            url: `QuestionnaireSettings`,
        });
        if (isFailure(response)) {
            console.error(response.error);
        }
        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).QuestionnaireSettings[0] as any;
        });
    });

    const [patientSettingsRD] = useService(async () => {
        const response = await service({
            method: 'GET',
            url: `PatientSettings?_ilike=${patient.id}`,
        });

        if (isFailure(response)) {
            console.log(response.status, response.error);
            return response;
        }

        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).PatientSettings[0] as any;
        });
    }, []);

    const [questionnaireListRD] = useService(async () => {
        const response = await service({
            method: 'GET',
            url: `QuestionnaireResponse?_ilike=${patient && patient.id}`,
        });

        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).QuestionnaireResponse as any;
        });
    }, []);

    const settingsMapRD = sequenceMap({
        activeQuestionnaireMap: activeQuestionnaireMapRD,
        patientSettings: patientSettingsRD,
        questionnaireList: questionnaireListRD,
    });

    const questionnaireSelect = async (name: string) => {
        const data = {
            patientId: patient.id,
            selectedQuestionnaire: name,
        };
        await service({
            url: '/PatientSettings/$save-patient-settings',
            method: 'POST',
            data: data,
        });
        setQuestionnaireSelected(name);
    };

    return { settingsMapRD, questionnaireSelect, questionnaireSelected, setQuestionnaireSelected };
};
