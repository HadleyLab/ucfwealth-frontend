import { Spin } from 'antd';
import React from 'react';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';

import { PatientProgressListTable } from 'src/components/PatientProgressListTable';

import { usePatientProgressList } from './usePatientProgressList';

export const PatientProgressList = () => {
    const { patientListWithCountRD } = usePatientProgressList();

    return (
        <RenderRemoteData
            remoteData={patientListWithCountRD}
            renderLoading={() => <Spin />}
            renderFailure={(error) => (
                <div>Error during loading patient list: {JSON.stringify(error)}</div>
            )}
        >
            {(data) => (
                <PatientProgressListTable
                    patientList={data.patientList}
                    patientCount={data.patientCount}
                />
            )}
        </RenderRemoteData>
    );
};
