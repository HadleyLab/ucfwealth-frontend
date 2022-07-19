import { useLocation } from 'react-router-dom';

import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure, isSuccess } from 'aidbox-react/src/libs/remoteData';
import { service } from 'aidbox-react/src/services/service';

const downloadFile = async (key: string) => {
    const result = await service({
        method: 'GET',
        url: '$download-dicom_file',
        params: { key },
    });

    if (isSuccess(result)) {
        window.open(result.data.url);
    }

    if (isFailure(result)) {
        console.log(JSON.stringify(result.error));
    }

    return result;
};

const removePatientIdFromFileKey = (fileKey: string) => {
    return fileKey
        .split('/')
        .filter((el, key) => key !== 0)
        .join('/');
};

const getPenultimateElement = (array: string[]) => array[array.length - 2];

const getPatientId = () => {
    const link = window.location.href;
    const stringArray = link.split('/');
    return getPenultimateElement(stringArray);
};

export const usePatientFileList = () => {
    const location = useLocation();

    const patientId = location.pathname.split('/')[2];

    const [fileListRD] = useService(() =>
        service({
            method: 'GET',
            url: '$list-patient-dicom-files',
            params: {
                patientId: patientId,
            },
        }),
    );

    return { fileListRD, downloadFile, removePatientIdFromFileKey, getPatientId };
};
