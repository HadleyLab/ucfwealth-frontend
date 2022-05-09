import { useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { useService } from 'aidbox-react/src/hooks/service';
import { getFHIRResource } from 'aidbox-react/src/services/fhir';

import { Patient, User } from 'shared/src/contrib/aidbox';

import { RouteItem } from 'src/utils/route';

interface Props {
    user: User;
}

export const usePatientApp = ({ user }: Props) => {
    let match = useRouteMatch();
    const routes: RouteItem[] = [
        {
            url: `https://beda.software/breast-cancer/`,
            title: 'Home',
        },
        {
            path: `${match.url}/questionnaire`,
            title: 'Profile data',
        },
        {
            url: `https://uci.beda.software/${user.data.patient?.id}`,
            title: 'Medical data',
        },
        {
            url: `https://community.covidimaging.app/`,
            title: 'Community',
        },
    ];

    const patientRef = user.data.patient;

    if (patientRef === undefined) {
        console.error('patientRef undefined');
    }

    const [isSuccessQuestionnaire, setIsSuccessQuestionnaire] = useState(false);

    const [patientRD] = useService<Patient>(() => getFHIRResource<Patient>(patientRef!));

    return { routes, patientRD, match, isSuccessQuestionnaire, setIsSuccessQuestionnaire };
};
