import { Spin } from 'antd';
import React from 'react';

import { PatientListTable } from 'src/components/PatientListTable';
import { RenderRemoteData } from 'src/components/RenderRemoteData';

import { usePatientList } from './usePatientList';

export const PatientList = () => {
    const { patientListRD } = usePatientList();

    return (
        <RenderRemoteData
            remoteData={patientListRD}
            renderLoading={() => <Spin />}
            renderFailure={(error) => (
                <div>Error during loading patient list: {JSON.stringify(error)}</div>
            )}
        >
            {(patientList) => <PatientListTable patientList={patientList} />}
        </RenderRemoteData>
    );
};
