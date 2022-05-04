import { useService } from 'aidbox-react/src/hooks/service';
import {
    failure,
    isFailure,
    isSuccess,
    RemoteData,
    success,
} from 'aidbox-react/src/libs/remoteData';
import { getFHIRResources } from 'aidbox-react/src/services/fhir';
import { service } from 'aidbox-react/src/services/service';

import { Bundle, Patient, Questionnaire } from 'shared/src/contrib/aidbox';

export interface ExtendedPatient extends Patient {
    email?: string;
    questionnaire?: Questionnaire;
    lastActivity?: string;
}

const getPatientList = async (remoteData: RemoteData<Bundle<Patient>, any>) => {
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

                const email = userResponse.data.entry[0].resource.email;

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
    } else return {}
};

export const usePatientList = () => {
    const [patientListRD] = useService(async () => {
        const response = await getFHIRResources<Patient>('Patient', {
            _sort: '-lastUpdated',
        });

        if (isFailure(response)) {
            console.error(response.error);
            return failure(response);
        }

        const patientList = await getPatientList(response);

        return success((patientList as unknown) as ExtendedPatient[]);
    }, []);

    return { patientListRD };
};
