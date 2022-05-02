import * as React from 'react';

import { Patient } from 'shared/src/contrib/aidbox';

interface Props {
    patientList: Patient[];
}

export const PatientList = ({ patientList }: Props) => {
    return (
        <div>
            {patientList.map((patient: Patient) => {
                return <div key={patient.id}>{patient.name?.[0].text}</div>;
            })}
        </div>
    );
};
