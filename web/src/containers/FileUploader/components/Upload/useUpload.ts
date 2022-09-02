import { useState } from 'react';

import { isFailure } from 'aidbox-react/src/libs/remoteData';
import { service } from 'aidbox-react/src/services/service';

export type AccountCredentials = [accountId: string, accountKey: string];

const filterByExtension = (file: any) => file.name.substr(-4) === '.dcm';

const createHederaAccount = async () => {
    const response = await service({
        method: 'GET',
        url: '/api/create-hedera-account',
    });
    if (isFailure(response)) {
        return { accountId: '', accountKey: '' };
    }
    return {
        accountId: response.data.hederaAccount.accountId,
        accountKey: response.data.hederaAccount.accountKey,
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
