import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useService } from 'aidbox-react/src/hooks/service';
import { service } from 'aidbox-react/src/services/service';

export const usePatientFileList = () => {
    const location = useLocation();

    const patientId = location.pathname.split('/')[2];

    const [fileListCoordinator, setFileListCoordinator] = useState(['']);

    const [fileListRD] = useService(() => {
        return service({
            method: 'GET',
            url: '$list-patient-dicom-files',
            params: {
                patientId,
            },
        });
    }, [fileListCoordinator]);

    return { fileListRD, patientId, setFileListCoordinator };
};
