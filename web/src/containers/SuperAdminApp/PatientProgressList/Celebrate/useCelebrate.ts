import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { failure, isFailure, isSuccess, success } from 'aidbox-react/src/libs/remoteData';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/src/services/fhir';
import { service } from 'aidbox-react/src/services/service';

import { id, Meta } from 'shared/src/contrib/aidbox';

import { ExtendedPatient } from 'src/containers/SuperAdminApp/PatientProgressList/usePatientProgressList';

import { useInterval } from './useInterval';

interface ResultCreationNft {
    status?: 'in-progress' | 'completed';
    patient?: { id: string; resourceType: 'Patient' };
    id?: id;
    meta?: Meta;
    resourceType: 'ResultCreationNft';
}

const getPatientHederaAccount = async (patientId: string) => {
    const response = await service({
        method: 'GET',
        url: `HederaAccount?_ilike=${patientId}`,
    });

    if (isFailure(response)) {
        console.error(response.error);
        return failure(response);
    }

    return success(response);
};

const createNft = async (patientId: string) => {
    const response = await service({
        method: 'GET',
        url: '$create-nft',
        params: { patientId },
    });
    return response;
};

const setResultCreationNftResourceInProgress = async (patientId: string) => {
    const response = await service({
        method: 'GET',
        url: '$set-in-progress-create-nft',
        params: { patientId },
    });
    return response;
};

const celebrateService = async (patientId: string) => {
    const setInProgressResponse = await setResultCreationNftResourceInProgress(patientId);
    if (isFailure(setInProgressResponse)) {
        const description = JSON.stringify(setInProgressResponse.error);
        return failure(description);
    }

    const getHederaAccountResponse = await getPatientHederaAccount(patientId);
    if (isFailure(getHederaAccountResponse)) {
        const description = JSON.stringify(getHederaAccountResponse.error);
        return failure(description);
    }
    const isAccountExists = isSuccess(getHederaAccountResponse)
        ? Boolean(getHederaAccountResponse.data.data.entry.length > 0)
        : false;
    if (!isAccountExists) {
        const description = 'Hedera account does not exist';
        return failure(description);
    }

    const createNftResponse = await createNft(patientId);
    if (isFailure(createNftResponse)) {
        const description = 'Create NFT failure: ' + createNftResponse.error;
        return failure(description);
    }
    const createNftMessage = createNftResponse?.data?.text;
    return success(createNftMessage);
};

interface Props {
    patient: ExtendedPatient;
}

export const useCelebrate = ({ patient }: Props) => {
    const [status, setStatus] = useState<'in-progress' | 'completed'>('in-progress');

    const [disabled, setDisabled] = useState(true);

    const celebrate = useCallback(async () => {
        if (!patient.id) {
            const description = 'Patient id does not exist';
            console.error(description);
            message.error(description);
            return;
        }
        setStatus('in-progress');
        const response = await celebrateService(patient.id);
        if (isFailure(response)) {
            console.error(response.error);
            message.error(response.error);
        } else {
            console.log(response.data);
            message.warning(response.data);
        }
        setStatus('completed');
    }, [patient.id]);

    useInterval(async () => {
        if (status === 'in-progress') {
            if (!patient.id) {
                console.log('Patient id does not exist');
                return;
            }
            const response = await getFHIRResources<ResultCreationNft>('ResultCreationNft', {
                patient: patient.id,
            });
            if (isFailure(response)) {
                message.error(response.error);
                setStatus('completed');
                return failure(response.error);
            }
            const resultCreationNft = extractBundleResources(response.data).ResultCreationNft[0];
            if (resultCreationNft && resultCreationNft.status === 'completed') {
                setStatus('completed');
                message.success(`Creation of NFT for patient ${patient.id} completed`);
            } else {
                setStatus('in-progress');
            }
        }
    }, 3000);

    useEffect(() => {
        (async function () {
            if (!patient.id) {
                console.log('Patient id does not exist');
                return;
            }
            const response = await getFHIRResources<ResultCreationNft>('ResultCreationNft', {
                patient: patient.id,
            });
            if (isFailure(response)) {
                console.error(response.error);
                setStatus('completed');
            }
            if (isSuccess(response)) {
                const resultCreationNft = extractBundleResources(response.data)
                    .ResultCreationNft[0];
                if (resultCreationNft && resultCreationNft.status === 'in-progress') {
                    setStatus('in-progress');
                } else {
                    setStatus('completed');
                }
            }
            setDisabled(false);
        })();
    }, []);

    return { status, setStatus, disabled, setDisabled, celebrate };
};
