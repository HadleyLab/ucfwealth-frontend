import { Space, Spin } from 'antd';
import { useState } from 'react';

import { isSuccess } from 'aidbox-react/src/libs/remoteData';

import { useInterval } from 'src/containers/UnprivilegedApp/useInterval';
import { getUserInfo } from 'src/services/auth';

export function UnprivilegedApp() {
    const [checkPatient, setCheckPatient] = useState(true);
    const checkPatientCreated = async () => {
        const response = await getUserInfo();
        if (isSuccess(response)) {
            const data = response.data.data;
            return 'patient' in data;
        }
        console.error(response.error);
        return false;
    };
    useInterval(async () => {
        if (checkPatient) {
            const patientCreated = await checkPatientCreated();
            if (patientCreated) {
                setCheckPatient(false);
                window.location.reload();
            }
        }
    }, 3000);
    return (
        <Space size="middle">
            <Spin size="large" />
        </Space>
    );
}
