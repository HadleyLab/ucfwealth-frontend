import { notification } from 'antd';
import React from 'react';

import { useService } from 'aidbox-react/src/hooks/service';
import { isSuccessAll, success, isFailure, isSuccess } from 'aidbox-react/src/libs/remoteData';
import {
    getFHIRResource,
    saveFHIRResource,
    findFHIRResource,
} from 'aidbox-react/src/services/fhir';
import { service } from 'aidbox-react/src/services/service';

import { Patient, Questionnaire, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { RenderRemoteData } from 'src/components/RenderRemoteData';

interface QuestionnaireResponseFormData {
    questionnaire: Questionnaire;
    questionnaireResponse: QuestionnaireResponse;
}

function useQuestionnaireForm(patient) {
    const questionnaireId = 'covid19';
    const [questFormRespRD] = useService<Questionnaire>(async () => {
        const questRD = await getFHIRResource({
            resourceType: 'Questionnaire',
            id: questionnaireId,
        });
        if (isFailure(questRD)) {
            console.log(questRD.error);
            return;
        }
        const populatedQuestRespRD = await getQR(patient);
        if (isSuccessAll([questRD, populatedQuestRespRD])) {
            return success({
                questionnaire: questRD.data,
                questionnaireResponse: populatedQuestRespRD.data,
            });
        }
    }, []);

    const saveQR = async (data: QuestionnaireResponse) => {
        const preparedQR: QuestionnaireResponse = {
            ...data,
            status: 'final',
            subject: { resourceType: 'Patient', id: patient.id },
        };
        const response = await saveFHIRResource<QuestionnaireResponse>(preparedQR);
        if (isFailure(response)) {
            console.log('Error!', response.error);
            notification.error({ message: JSON.stringify(response.error) });
        }
        if (isSuccess(response)) {
            notification.success({ message: 'Questionnaire saved' });
            // window.location.reload();
        }
    };

    async function getQR() {
        const existingQRRD = await findFHIRResource<QuestionnaireResponse>(
            'QuestionnaireResponse',
            {
                questionnaire: questionnaireId,
                patient: patient.id,
            },
        );
        if (isFailure(existingQRRD)) {
            return getPopulatedQR();
        }
        return existingQRRD;

        // return getPopulatedQR(patientResource);
    }

    async function getPopulatedQR() {
        const response = service<QuestionnaireResponse>({
            method: 'POST',
            url: `/Questionnaire/${questionnaireId}/$populate`,
            data: {
                resourceType: 'Parameters',
                parameter: [{ name: 'LaunchPatient', resource: patient }],
            },
        });
        if (isFailure(response)) {
            console.log(response.error);
            return;
        }
        return response;
    }

    return [questFormRespRD, saveQR];
}

interface QuestionnaireFormProps {
    patient: Patient;
}

export const QuestionnaireForm = (props: QuestionnaireFormProps) => {
    const [questFormRespRD, saveQR] = useQuestionnaireForm(props.patient);
    return (
        <div>
            <h2>Covid 19 questionnaire</h2>
            <RenderRemoteData<QuestionnaireResponseFormData> remoteData={questFormRespRD}>
                {(data) => (
                    <QuestionnaireResponseForm
                        key={data.questionnaire.id}
                        questionnaire={data.questionnaire}
                        resource={data.questionnaireResponse}
                        onSave={saveQR}
                    />
                )}
            </RenderRemoteData>
        </div>
    );
};
