import { useLocation } from 'react-router-dom';

import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure } from 'aidbox-react/src/libs/remoteData';
import { extractBundleResources, WithId } from 'aidbox-react/src/services/fhir';
import { mapSuccess, service } from 'aidbox-react/src/services/service';

import { QuestionnaireResponse } from 'shared/src/contrib/aidbox';

export const usePatientQuestionnaireResult = () => {
    const location = useLocation<any>();

    const patientId = location.pathname.split('/')[2];

    const [questionnaireResponseListRD] = useService(async () => {
        const response = await service({
            method: 'GET',
            url: `QuestionnaireResponse?_ilike=${patientId}`,
        });
        if (isFailure(response)) {
            console.error(response.error);
        }
        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle)
                .QuestionnaireResponse as WithId<QuestionnaireResponse>[];
        });
    });

    return { questionnaireResponseListRD, patientId };
};
