import { Button, message, Spin } from 'antd';

import { isFailure } from 'aidbox-react/src/libs/remoteData';

import { ExtendedPatient } from 'src/containers/SuperAdminApp/PatientProgressList/usePatientProgressList';

import { useCelebrate } from './useCelebrate';

interface CelebrateProps {
    patient: ExtendedPatient;
}

export const Celebrate = ({ patient }: CelebrateProps) => {
    const { status, setStatus, disabled, celebrate } = useCelebrate({ patient });

    return (
        <div style={{ width: '100px' }}>
            {status === 'completed' ? (
                <Button
                    disabled={disabled}
                    onClick={async () => {
                        const response = await celebrate();
                        if (isFailure(response)) {
                            console.error(response.error);
                            message.error(response.error);
                            setStatus('completed');
                        } else {
                            console.log(response.data);
                            message.warning(response.data);
                        }
                    }}
                >
                    Celebrate
                </Button>
            ) : (
                <div style={{ paddingTop: '5px' }}>
                    <Spin />
                </div>
            )}
        </div>
    );
};
