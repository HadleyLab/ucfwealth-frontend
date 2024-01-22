import { useState } from 'react';

export type AccountCredentials = [accountId: string, accountKey: string];

const filterByExtension = (file: any) => file.name.substr(-4) === '.dcm';

export const useUpload = () => {
    const [uploadFileName, setUploadFileName] = useState('');
    return {
        uploadFileName,
        setUploadFileName,
        filterByExtension,
    };
};
