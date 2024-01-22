import {
    useItemProgressListener,
    useBatchStartListener,
    useBatchProgressListener,
} from '@rpldy/uploady';
import { Circle } from 'rc-progress';
import { useEffect, useState } from 'react';

import { isFailure, isSuccess } from 'aidbox-react/src/libs/remoteData';
import { getFHIRResource } from 'aidbox-react/src/services/fhir';

import { Patient } from 'shared/src/contrib/aidbox';

import { sharedPatientId } from 'src/sharedState';

interface UploadProgressProps {
    getData: () => Promise<any>;
    uploadFileName: string;
    setFileListCoordinator: (array: string[]) => void;
}

export const UploadProgress = ({
    // TODO Refactor this component
    getData,
    uploadFileName,
    setFileListCoordinator,
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

    const workAfterUpload = async () => {
        const patientId = sharedPatientId.getSharedState().id;
        const patientExists = await checkPatientExists(patientId);
        console.log('The patient exists:', patientExists);
        console.log('Patient ID:', patientId);
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
