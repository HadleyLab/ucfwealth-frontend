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

import { Bundle, Patient, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

export interface ExtendedPatient extends Patient {
    email?: string;
    questionnaireList?: QuestionnaireResponse[];
    lastActivity?: string;
}

const getPatientList = async (remoteData: RemoteData<Bundle<Patient>, any>) => {
    if (isFailure(remoteData)) {
        console.log(JSON.stringify(remoteData.error));
        return failure(remoteData.error);
    }
    if (isSuccess(remoteData)) {
        if (remoteData.data.entry === undefined) {
            console.error('No patients found');
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
                        ? "ucfwealth+" + patient?.name[0]?.given[0].toLowerCase() + '@beda.software'
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

                const questionnaireList = questionnaireResponse.data.entry;

                const questionnaireLastUpdated =
                    questionnaireResponse.data.entry?.[0]?.resource?.meta?.lastUpdated;

                let lastActivity = patient?.meta?.lastUpdated;

                if (questionnaireLastUpdated !== undefined) {
                    lastActivity = questionnaireLastUpdated;
                }
                return { ...patient, email, questionnaireList, lastActivity };
            }),
        );
        return patientList;
    }
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

        const patientList = await getPatientList(response);

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

    return { patientListWithCountRD };
};
