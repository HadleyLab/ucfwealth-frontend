import { Spin } from 'antd';
import React from 'react';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';

import { PatientList } from 'src/components/PatientList/PatientList';

import { usePatientList } from './usePatientList';

export const PatientListContainer = () => {
    const { patientListRD } = usePatientList();

    return (
        <RenderRemoteData
            remoteData={patientListRD}
            renderLoading={() => <Spin />}
            renderFailure={(error) => (
                <div>Error during loading patient list: {JSON.stringify(error)}</div>
            )}
        >
            {(patientList) => {
                return <PatientList patientList={patientList} />;
            }}
        </RenderRemoteData>
    );
};
