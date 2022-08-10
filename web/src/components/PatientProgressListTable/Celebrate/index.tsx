import { Button, Spin } from 'antd';
import { useState } from 'react';

import { Patient } from 'shared/src/contrib/aidbox';

import { ExtendedPatient } from 'src/containers/SuperAdminApp/PatientProgressList/usePatientProgressList';

interface CelebrateProps {
    celebrate: (patient: Patient, setLoading: (loading: boolean) => void) => Promise<string>;
    patient: ExtendedPatient;
}

export const Celebrate = ({ celebrate, patient }: CelebrateProps) => {
    const [loading, setLoading] = useState(false);

    return (
        <div>
            {!loading ? (
                <Button onClick={() => celebrate(patient, setLoading)}>Celebrate</Button>
            ) : (
                <div style={{ paddingTop: '5px' }}>
                    <Spin />
                </div>
            )}
        </div>
    );
};
