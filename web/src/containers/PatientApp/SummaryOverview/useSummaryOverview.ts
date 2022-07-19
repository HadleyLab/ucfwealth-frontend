import { useService } from 'aidbox-react/src/hooks/service';
import { service } from 'aidbox-react/src/services/service';

import { sharedPatientId } from 'src/sharedState';

export const useSummaryOverview = () => {
    const patientId = sharedPatientId.getSharedState().id;

    const [fileListRD] = useService(() =>
        service({
            method: 'GET',
            url: '$list-patient-dicom-files',
            params: {
                patientId,
            },
        }),
    );

    return { fileListRD, patientId };
};
