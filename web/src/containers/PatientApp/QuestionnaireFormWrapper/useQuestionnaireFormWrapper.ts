import { useState } from 'react';

import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure } from 'aidbox-react/src/libs/remoteData';
import { extractBundleResources } from 'aidbox-react/src/services/fhir';
import { mapSuccess, sequenceMap, service } from 'aidbox-react/src/services/service';

import { Patient } from 'shared/src/contrib/aidbox';

import { useActiveQuestionnaireList } from 'src/containers/SuperAdminApp/QuestionnaireAvailableBadge/useActiveQuestionnaireList';

interface Props {
    patient: Patient;
}

export const useQuestionnaireFormWrapper = ({ patient }: Props) => {
    const [questionnaireSelected, setQuestionnaireSelected] = useState('');

    const { activeQuestionnaireMapRD } = useActiveQuestionnaireList();

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

    const settingsMapRD = sequenceMap({
        activeQuestionnaireMap: activeQuestionnaireMapRD,
        patientSettings: patientSettingsRD,
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
