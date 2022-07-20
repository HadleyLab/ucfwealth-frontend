import { useHistory, useRouteMatch } from 'react-router-dom';

import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure } from 'aidbox-react/src/libs/remoteData';
import { service } from 'aidbox-react/src/services/service';

import { sharedPatientId } from 'src/sharedState';

export const useSummaryOverview = () => {
    const patientId = sharedPatientId.getSharedState().id;

    const [fileListRD] = useService(async () => {
        const response = await service({
            method: 'GET',
            url: '$list-patient-dicom-files',
            params: {
                patientId,
            },
        });

        if (isFailure(response)) {
            console.error(response.error);
        }

        return response;
    });

    const [questionnaireListRD] = useService(async () => {
        const response = await service({
            method: 'GET',
            url: `QuestionnaireResponse?_ilike=${patientId}`,
        });

        if (isFailure(response)) {
            console.error(response.error);
        }

        return response;
    });

    const match = useRouteMatch();
    const history = useHistory();
    const goToQuestionnaire = () => history.push({ pathname: `${match.url}/questionnaire` });

    return { fileListRD, questionnaireListRD, patientId, goToQuestionnaire };
};
