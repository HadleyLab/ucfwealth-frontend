import { Patient } from 'fhir/r4b';
import _ from 'lodash';

import { formatHumanDate, getPersonAge } from '@beda.software/emr/utils';

export function useGeneralInformationDashboard(patient: Patient) {
    const patientDetails = [
        {
            title: 'Birth date',
            value: patient.birthDate
                ? `${formatHumanDate(patient.birthDate)} • ${getPersonAge(patient.birthDate)}`
                : undefined,
        },
        {
            title: 'Sex',
            value: _.upperFirst(patient.gender),
        },
        {
            title: 'Phone number',
            value: patient.telecom?.filter(({ system }) => system === 'phone')[0]?.value,
        },
        {
            title: 'Email',
            value: patient.telecom?.filter(({ system }) => system === 'email')[0]?.value,
        },
    ];

    return { patientDetails };
}
