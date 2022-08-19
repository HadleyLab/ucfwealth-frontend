import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure } from 'aidbox-react/src/libs/remoteData';
import { extractBundleResources } from 'aidbox-react/src/services/fhir';
import { mapSuccess, sequenceMap, service } from 'aidbox-react/src/services/service';

import { useActiveQuestionnaireList } from 'src/containers/SuperAdminApp/QuestionnaireAvailableBadge/useActiveQuestionnaireList';

interface Props {
    patientId: string;
}

export const useQuestionnaireSummary = ({ patientId }: Props) => {
    const { activeQuestionnaireMapRD } = useActiveQuestionnaireList();

    const [patientSettingsRD] = useService(async () => {
        const response = await service({
            method: 'GET',
            url: `PatientSettings?_ilike=${patientId}`,
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

    return { settingsMapRD };
};
