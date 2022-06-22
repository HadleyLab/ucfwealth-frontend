import { useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { useService } from 'aidbox-react/src/hooks/service';
import { getFHIRResource } from 'aidbox-react/src/services/fhir';

import { Patient, User } from 'shared/src/contrib/aidbox';

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

    return { patientRD, match, isSuccessQuestionnaire, setIsSuccessQuestionnaire };
};
