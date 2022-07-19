import { isFailure, isSuccess } from 'aidbox-react/src/libs/remoteData';
import { service } from 'aidbox-react/src/services/service';

export const downloadFile = async (key: string) => {
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

export const removePatientIdFromFileKey = (fileKey: string) => {
    return fileKey
        .split('/')
        .filter((el, key) => key !== 0)
        .join('/');
};
