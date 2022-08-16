import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure } from 'aidbox-react/src/libs/remoteData';
import { extractBundleResources } from 'aidbox-react/src/services/fhir';
import { mapSuccess, service } from 'aidbox-react/src/services/service';

export const useActiveQuestionnaireList = () => {
    const [activeQuestionnaireListRD] = useService(async () => {
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
    return { activeQuestionnaireListRD };
};
