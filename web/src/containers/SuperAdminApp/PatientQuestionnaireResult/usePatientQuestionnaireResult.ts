import { useLocation } from 'react-router-dom';

import { useService } from 'aidbox-react/src/hooks/service';
import { getFHIRResource } from 'aidbox-react/src/services/fhir';

import { Patient } from 'shared/src/contrib/aidbox';

import { sharedPatientId } from 'src/sharedState';

export const usePatientQuestionnaireResult = () => {
    const location = useLocation<any>();

    const patientId = location.pathname.split('/')[2];

    const [patientRD] = useService<Patient>(async () => {
        const response = await getFHIRResource<Patient>({
            resourceType: 'Patient',
            id: patientId,
        });
        return response;
    });

    sharedPatientId.setSharedState({ id: patientId || '' });

    return { patientRD };
};
