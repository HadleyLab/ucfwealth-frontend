import { Button, Spin } from 'antd';

import { ExtendedPatient } from 'src/containers/SuperAdminApp/PatientProgressList/usePatientProgressList';

import { useCelebrate } from './useCelebrate';

interface CelebrateProps {
    patient: ExtendedPatient;
}

export const Celebrate = ({ patient }: CelebrateProps) => {
    const { loading, setLoading, disabled, celebrate } = useCelebrate({ patient });

    return (
        <div style={{width: '100px'}}>
            {loading === 'completed' ? (
                <Button disabled={disabled} onClick={() => celebrate(patient, setLoading)}>Celebrate</Button>
            ) : (
                <div style={{ paddingTop: '5px' }}>
                    <Spin />
                </div>
            )}
        </div>
    );
};
