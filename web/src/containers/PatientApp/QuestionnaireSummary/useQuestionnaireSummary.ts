import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure } from 'aidbox-react/src/libs/remoteData';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/src/services/fhir';
import { mapSuccess, sequenceMap } from 'aidbox-react/src/services/service';

import { Questionnaire } from 'shared/src/contrib/aidbox';

interface Props {
    patientId: string;
}

export const useQuestionnaireSummary = ({ patientId }: Props) => {
    const [patientSettingsRD] = useService(async () => {
        const response = await getFHIRResources('PatientSettings', {
            patient: patientId,
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
        const response = await getFHIRResources('Questionnaire', {});
        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).Questionnaire as Questionnaire[];
        });
    });

    const settingsMapRD = sequenceMap({
        patientSettings: patientSettingsRD,
        questionnaireList: questionnaireListRD,
    });

    return { settingsMapRD };
};
