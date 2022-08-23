import {
    useItemProgressListener,
    useBatchStartListener,
    useBatchProgressListener,
} from '@rpldy/uploady';
import axios from 'axios';
import { Circle } from 'rc-progress';
import { useEffect, useState } from 'react';

import { sharedPatientId } from 'src/sharedState';

interface UploadProgressProps {
    getData: () => Promise<any>;
    uploadFileName: string;
    setAccountCredentials: (accountCredentials: [accountId: string, accountKey: string]) => void;
    setShowModal: (showModal: boolean) => void;
    createHederaAccount: () => Promise<{
        accountId: string;
        accountKey: string;
    }>;
}

export const UploadProgress = ({
    // TODO Refactor this component
    getData,
    uploadFileName,
    setAccountCredentials,
    setShowModal,
    createHederaAccount,
}: UploadProgressProps) => {
    const progressData = useItemProgressListener() || { completed: 0 };

    const { completed } = progressData;

    const [barchProgress, setBatchProgress] = useState(0);

    useBatchStartListener(() => {
        setBatchProgress(() => 1);
    });

    useBatchProgressListener((batch) => {
        setBatchProgress(() => batch.completed);
    });

    const updateFileList = async () => {
        for (let i = 0; i < 30; i++) {
            const data = await getData();
            if (data.includes(uploadFileName)) break;
        }
    };

    const gateway = 'http://localhost:8080';

    const checkPatientExists = async (id: string) => {
        try {
            const response = await axios.get(`${gateway}/$check-patient-exists?patientId=${id}`);
            return response.data.isPatientExist;
        } catch (error) {
            console.log(error);
        }
    };

    const checkHederaAccountExists = async (patientId: string) => {
        try {
            const response = await axios.get(
                `${gateway}/$check-hedera-account-exists?patientId=${patientId}`,
            );
            console.log(response);
            return response.data.isHederaAccountExist;
        } catch (error) {
            console.log(error);
        }
    };

    const showHederaAccountModal = (accountId: string, accountKey: string) => {
        setAccountCredentials([accountId, accountKey]);
        setShowModal(true);
    };

    const saveHederaAccountId = async (
        patientId: string,
        accountId: string,
        accountKey: string,
    ) => {
        const saveData = {
            patientId,
            accountId,
            accountKey,
        };
        try {
            const response = await axios.post(
                `${gateway}/HederaAccount/$save-hedera-account-id`,
                saveData,
            );
            console.log('Account is created:', response.data.isHederaAccountSaved);
            return response.data.isHederaAccountSaved;
        } catch (error) {
            console.log(error);
        }
    };

    const createAndSaveHederaAccount = async (patientId: string) => {
        const { accountId, accountKey } = await createHederaAccount();
        await saveHederaAccountId(patientId, accountId, accountKey);
        showHederaAccountModal(accountId, accountKey);
    };

    const workAfterUpload = async () => {
        const patientId = sharedPatientId.getSharedState().id;
        const patientExists = await checkPatientExists(patientId);
        console.log('The patient exists:', patientExists);
        console.log('Patient ID:', patientId);
        if (patientExists) {
            const isHederaAccountExist = await checkHederaAccountExists(patientId);
            if (!isHederaAccountExist) {
                createAndSaveHederaAccount(patientId);
            } else {
                console.log('Hedera account already exists');
            }
        } else {
            console.log('The patient with the specified id does not exist');
        }
        updateFileList();
    };

    useEffect(() => {
        if (completed === 100) {
            workAfterUpload();
        }
    }, [progressData]);

    return (
        <div
            className={
                completed === 0 ? 'uploading-progress-not-started' : 'uploading-progress-started'
            }
        >
            <Circle
                className="progress-circle"
                strokeWidth={5}
                strokeColor={barchProgress === 100 ? '#52C41A' : '#1491BD'}
                percent={barchProgress}
            />
            <span className="barch-progress">
                {barchProgress === 100 ? 'All done!' : 'Uploading...'}
            </span>
        </div>
    );
};
