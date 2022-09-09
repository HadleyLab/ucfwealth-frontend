import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { failure, isFailure, isSuccess, success } from 'aidbox-react/src/libs/remoteData';
import { getFHIRResource } from 'aidbox-react/src/services/fhir';
import { service } from 'aidbox-react/src/services/service';

import { Patient } from 'shared/src/contrib/aidbox';

import { ExtendedPatient } from 'src/containers/SuperAdminApp/PatientProgressList/usePatientProgressList';

import { useInterval } from './useInterval';

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

const describeError = (
    setLoading: (loading: 'in-progress' | 'completed') => void,
    description: string,
) => {
    console.error(description);
    message.error(description);
    setLoading('completed');
    return description;
};

const celebrate = async (
    patient: Patient,
    setLoading: (loading: 'in-progress' | 'completed') => void,
) => {
    setLoading('in-progress');

    if (!patient.id) {
        const description = 'Patient id does not exist';
        return describeError(setLoading, description);
    }

    console.log('Patient ID: ', patient.id);

    const response = await getPatientHederaAccount(patient.id);

    if (isFailure(response)) {
        const description = JSON.stringify(response.error);
        return describeError(setLoading, description);
    }

    const isAccountExists = isSuccess(response)
        ? Boolean(response.data.data.entry.length > 0)
        : false;

    if (!isAccountExists) {
        const description = 'Hedera account does not exist';
        return describeError(setLoading, description);
    }

    const createNftResponse = await createNft(patient.id);

    if (isFailure(createNftResponse)) {
        const description = 'Create NFT failure: ' + createNftResponse.error;
        return describeError(setLoading, description);
    }

    const createNftMessage = createNftResponse?.data?.text;
    console.log(createNftMessage);
    message.success(createNftMessage);
    return createNftMessage;
};

interface Props {
    patient: ExtendedPatient;
}

export const useCelebrate = ({ patient }: Props) => {
    const [loading, setLoading] = useState<'in-progress' | 'completed'>('in-progress');

    const [disabled, setDisabled] = useState(true);

    useInterval(async () => {
        if (loading === 'in-progress') {
            if (!patient.id) {
                console.log('Patient id does not exist');
                return;
            }
            const response = await getFHIRResource<any>({
                resourceType: 'ResultCreationNft',
                id: patient.id,
            });
            if (isFailure(response)) {
                setLoading('completed');
            }
            if (isSuccess(response)) {
                if (response.data.status === 'completed') {
                    setLoading('completed');
                    message.success(`Creation of NFT for patient ${patient.id} completed`);
                } else {
                    setLoading('in-progress');
                }
            }
        }
    }, 3000);

    const configureButton = useCallback(async () => {
        if (!patient.id) {
            console.log('Patient id does not exist');
            return;
        }
        const response = await getFHIRResource<any>({
            resourceType: 'ResultCreationNft',
            id: patient.id,
        });
        if (isFailure(response)) {
            setLoading('completed');
        }
        if (isSuccess(response)) {
            if (response.data.status === 'in-progress') {
                setLoading('in-progress');
            } else {
                setLoading('completed');
            }
        }
        setDisabled(false);
    }, []);

    useEffect(() => {
        configureButton();
    }, [configureButton]);

    return { loading, setLoading, disabled, setDisabled, celebrate };
};
