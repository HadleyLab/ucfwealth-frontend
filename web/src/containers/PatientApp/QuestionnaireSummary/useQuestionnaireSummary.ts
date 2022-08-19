import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure } from 'aidbox-react/src/libs/remoteData';
import { extractBundleResources } from 'aidbox-react/src/services/fhir';
import { mapSuccess, sequenceMap, service } from 'aidbox-react/src/services/service';

interface Props {
    patientId: string;
}

export const useQuestionnaireSummary = ({ patientId }: Props) => {
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
