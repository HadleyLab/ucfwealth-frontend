import { Button, notification, Spin } from 'antd';
import { useState } from 'react';

import { isSuccess } from 'aidbox-react/src/libs/remoteData';
import { getFHIRResource } from 'aidbox-react/src/services/fhir';

import { Patient } from 'shared/src/contrib/aidbox';

import { ExtendedPatient } from 'src/containers/SuperAdminApp/PatientProgressList/usePatientProgressList';

import { useInterval } from './useInterval';

interface CelebrateProps {
    celebrate: (patient: Patient, setLoading: (loading: boolean) => void) => Promise<string>;
    patient: ExtendedPatient;
}

export const Celebrate = ({ celebrate, patient }: CelebrateProps) => {
    const [loading, setLoading] = useState(false);

    //@ts-ignore
    useInterval(async () => {
        if (loading) {
            const response = await getFHIRResource<any>({
                resourceType: 'ResultCreationNft',
                id: patient.id!,
            });
            if (isSuccess(response) && response.data.status === 'in-progress') {
                setLoading(true);
            } else if (isSuccess(response) && response.data.status === 'completed') {
                setLoading(false);
            }
        }
    }, 3000);

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
