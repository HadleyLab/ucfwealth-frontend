import {
    useItemProgressListener,
    useBatchStartListener,
    useBatchProgressListener,
} from '@rpldy/uploady';
import { Circle } from 'rc-progress';
import { useEffect, useState } from 'react';

import { isFailure, isSuccess } from 'aidbox-react/src/libs/remoteData';
import {
    extractBundleResources,
    getFHIRResource,
    saveFHIRResource,
} from 'aidbox-react/src/services/fhir';
import { mapSuccess, service } from 'aidbox-react/src/services/service';

import { Patient } from 'shared/src/contrib/aidbox';

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
    setFileListCoordinator: (array: string[]) => void;
}

export const UploadProgress = ({
    // TODO Refactor this component
    getData,
    uploadFileName,
    setAccountCredentials,
    setShowModal,
    createHederaAccount,
    setFileListCoordinator
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
            if (data.includes(uploadFileName)) {
                setFileListCoordinator(data);
                break;
            }
        }
    };

    const checkPatientExists = async (patientId: string) => {
        const response = await getFHIRResource<Patient>({
            resourceType: 'Patient',
            id: patientId,
        });
        if (isSuccess(response)) return true;
        if (isFailure(response)) return false;
    };

    const checkHederaAccountExists = async (patientId: string) => {
        const response = await service({
            method: 'GET',
            url: `HederaAccount?_ilike=${patientId}`,
        });
        return Boolean(
            mapSuccess(response, (bundle) => extractBundleResources(bundle).HederaAccount)['data']
                .length,
        );
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
        const resource = {
            patient: { id: patientId, resourceType: 'Patient' },
            accountId,
            accountKey,
            resourceType: 'HederaAccount',
        };
        return await saveFHIRResource(resource);
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
