import axios from 'axios';
import { useState } from 'react';

import { FILE_UPLOADER_BACKEND_URL } from '../../config.url';

export type AccountCredentials = [accountId: string, accountKey: string];

const filterByExtension = (file: any) => file.name.substr(-4) === '.dcm';

const createHederaAccount = async () => {
    const gateway = window.gateway ?? FILE_UPLOADER_BACKEND_URL;
    const response = await axios(`${gateway}/api/create-hedera-account`);
    return {
        accountId: response.data.accountId,
        accountKey: response.data.accountKey,
    };
};

export const useUpload = () => {
    const [uploadFileName, setUploadFileName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [accountCredentials, setAccountCredentials] = useState<AccountCredentials>(['', '']);
    return {
        uploadFileName,
        setUploadFileName,
        showModal,
        setShowModal,
        accountCredentials,
        setAccountCredentials,
        createHederaAccount,
        filterByExtension,
    };
};
