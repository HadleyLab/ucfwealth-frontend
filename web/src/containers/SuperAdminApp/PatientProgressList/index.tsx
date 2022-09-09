import { PatientProgressListTable } from 'src/components/PatientProgressListTable';
import { RenderRemoteData } from 'src/components/RenderRemoteData';

import { usePatientProgressList } from './usePatientProgressList';

export const PatientProgressList = () => {
    const { patientListWithCountRD } = usePatientProgressList();

    return (
        <RenderRemoteData
            remoteData={patientListWithCountRD}
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
