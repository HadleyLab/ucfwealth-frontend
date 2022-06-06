import { AccountId, PrivateKey, TokenId } from '@hashgraph/sdk';

import { useService } from 'aidbox-react/src/hooks/service';
import {
    failure,
    isFailure,
    isSuccess,
    RemoteData,
    success,
} from 'aidbox-react/src/libs/remoteData';
import { getFHIRResources } from 'aidbox-react/src/services/fhir';
import { sequenceMap, service } from 'aidbox-react/src/services/service';

import { Bundle, Patient, Questionnaire } from 'shared/src/contrib/aidbox';

import {
    associateUserAccountWithNFT,
    createNewAccount,
    createNewNFT,
    patientBalanceCheck,
    transferNFT,
} from './hedera';

export interface ExtendedPatient extends Patient {
    email?: string;
    questionnaire?: Questionnaire;
    lastActivity?: string;
}

const getPatientList = async (remoteData: RemoteData<Bundle<Patient>, any>) => {
    if (isFailure(remoteData)) {
        console.log(JSON.stringify(remoteData.error));
        return failure(remoteData.error);
    }
    if (isSuccess(remoteData)) {
        if (remoteData.data.entry === undefined) {
            console.error('remoteData.data.entry === undefined');
            return {};
        }
        const patientList = await Promise.all(
            remoteData.data.entry.map(async (patientItem) => {
                const patient = patientItem.resource;

                const userResponse = await service({
                    method: 'GET',
                    url: `User?_ilike=${patient && patient.id}`,
                });

                if (isFailure(userResponse)) {
                    console.error(userResponse.error);
                    return { ...patient };
                }

                const email = `${
                    patient?.name && patient?.name[0].given
                        ? patient?.name[0]?.given[0].toLowerCase() + '@gmail.com'
                        : userResponse.data.entry[0].resource.email
                }`;

                const questionnaireResponse = await service({
                    method: 'GET',
                    url: `QuestionnaireResponse?_ilike=${patient && patient.id}`,
                });

                if (isFailure(questionnaireResponse)) {
                    console.error(questionnaireResponse.error);
                    return { ...patient, email };
                }

                const questionnaire = questionnaireResponse.data.entry[0];

                const questionnaireLastUpdated =
                    questionnaireResponse.data.entry?.[0]?.resource?.meta?.lastUpdated;

                let lastActivity = patient?.meta?.lastUpdated;

                if (questionnaireLastUpdated !== undefined) {
                    lastActivity = questionnaireLastUpdated;
                }
                return { ...patient, email, questionnaire, lastActivity };
            }),
        );
        return patientList;
    }
};

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

const postPatientHederaAccount = async (
    patientId: string,
    accountId: AccountId,
    accountKey: PrivateKey,
) => {
    const response = await service({
        method: 'POST',
        url: `HederaAccount`,
        data: {
            resourceType: 'HederaAccount',
            patientId,
            accountId: String(accountId),
            accountKey: String(accountKey),
        },
    });

    if (isSuccess(response)) {
        console.log(`Account ${String(accountId)} created`);
    }

    if (isFailure(response)) {
        console.error(response.error);
    }

    return response;
};

const checkIfAccountExists = (response: RemoteData<any, any>) => {
    return isSuccess(response) ? Boolean(response.data.data.entry.length > 0) : false;
};

const getAccount = async (
    isAccountExists: boolean,
    tokenId: TokenId,
    patientId: string,
    response: RemoteData<any, any>,
) => {
    if (isAccountExists && isSuccess(response)) {
        const { accountId, accountKey } = response.data.data.entry[0].resource;

        return { accountId, accountKey };
    }

    const { accountId, accountKey } = await createNewAccount();

    await postPatientHederaAccount(patientId, accountId, accountKey);

    return {
        accountId,
        accountKey,
    };
};

export const usePatientProgressList = () => {
    const [patientListRD] = useService(async () => {
        const response = await getFHIRResources<Patient>('Patient', {
            _sort: '-lastUpdated',
        });

        if (isFailure(response)) {
            console.error(response.error);
            return failure(response);
        }

        const patientList = await getPatientList(response); // TODO error here

        return success(patientList as unknown as ExtendedPatient[]);
    }, []);

    const [patientCountRD] = useService(async () => {
        const response = await getFHIRResources<Patient>('Patient', { _count: 0 });
        if (isFailure(response)) {
            console.error(response.error);
            return response;
        }
        return success(response.data.total);
    });

    const patientListWithCountRD = sequenceMap({
        patientList: patientListRD,
        patientCount: patientCountRD,
    });

    const celebrate = async (patient: Patient) => {
        console.log('Patient ID: ', patient.id);

        if (!patient.id) {
            console.error('Patient ID is undefined');
            return;
        }

        const { tokenId, CID } = await createNewNFT(patient.id);

        if (patient.id && tokenId) {
            const response = await getPatientHederaAccount(patient.id);

            const isAccountExists = checkIfAccountExists(response);

            const { accountId, accountKey } = await getAccount(
                isAccountExists,
                tokenId,
                patient.id,
                response,
            );
            await associateUserAccountWithNFT(tokenId, accountId, accountKey);
            await transferNFT(accountId, tokenId, CID);
            await patientBalanceCheck(accountId, tokenId);
        }
    };

    return { patientListWithCountRD, celebrate };
};
