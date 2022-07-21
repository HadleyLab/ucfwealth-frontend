import { useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure } from 'aidbox-react/src/libs/remoteData';
import { extractBundleResources, getFHIRResource, WithId } from 'aidbox-react/src/services/fhir';
import { mapSuccess, sequenceMap, service } from 'aidbox-react/src/services/service';

import { Patient, QuestionnaireResponse, User } from 'shared/src/contrib/aidbox';

interface Props {
    user: User;
}

export const usePatientApp = ({ user }: Props) => {
    let match = useRouteMatch();

    const patientRef = user.data.patient;

    if (patientRef === undefined) {
        console.error('patientRef undefined');
    }

    const [isSuccessQuestionnaire, setIsSuccessQuestionnaire] = useState(false);

    const [patientRD] = useService<Patient>(() => getFHIRResource<Patient>(patientRef!));

    const [questionnaireResponseListRD] = useService(async () => {
        const response = await service({
            method: 'GET',
            url: `QuestionnaireResponse?_ilike=${patientRef?.id}`,
        });
        if (isFailure(response)) {
            console.error(response.error);
        }
        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle)
                .QuestionnaireResponse as WithId<QuestionnaireResponse>[];
        });
    });

    const patientResultRD = sequenceMap({
        patient: patientRD,
        questionnaireResponseList: questionnaireResponseListRD,
    });

    return { patientResultRD, match, isSuccessQuestionnaire, setIsSuccessQuestionnaire };
};
