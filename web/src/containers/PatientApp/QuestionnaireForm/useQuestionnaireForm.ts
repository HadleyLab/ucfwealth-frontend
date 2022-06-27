import { notification } from 'antd';
import { useEffect, useState } from 'react';

import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure, isSuccess, isSuccessAll, success } from 'aidbox-react/src/libs/remoteData';
import {
    findFHIRResource,
    getFHIRResource,
    saveFHIRResource,
} from 'aidbox-react/src/services/fhir';
import { service } from 'aidbox-react/src/services/service';

import {
    Patient,
    Questionnaire,
    QuestionnaireItem,
    QuestionnaireResponse,
} from 'shared/src/contrib/aidbox';

interface QuestionnaireResponseFormData {
    questionnaire: Questionnaire;
    questionnaireResponse: QuestionnaireResponse;
}

interface Props {
    patient: Patient;
    questionnaireId: string;
}

export function useQuestionnaireForm({ patient, questionnaireId }: Props) {
    //TODO: fix types
    //@ts-ignore
    const [questFormRespRD] = useService<QuestionnaireResponseFormData>(async () => {
        const questRD = await getFHIRResource({
            resourceType: 'Questionnaire',
            id: questionnaireId,
        });
        if (isFailure(questRD)) {
            console.log(questRD.error);
            return;
        }
        const populatedQuestRespRD = await getQR();
        //TODO: fix types
        //@ts-ignore
        if (isSuccessAll([questRD, populatedQuestRespRD])) {
            return success({
                questionnaire: questRD.data,
                questionnaireResponse: populatedQuestRespRD!.data,
            });
        }
    }, [questionnaireId]);

    const saveQR = async (data: QuestionnaireResponse): Promise<void> => {
        const preparedQR: QuestionnaireResponse = {
            ...data,
            status: 'final',
            subject: { resourceType: 'Patient', id: patient.id! },
        };
        const response = await saveFHIRResource<QuestionnaireResponse>(preparedQR);
        if (isFailure(response)) {
            console.log('Error!', response.error);
            notification.error({ message: JSON.stringify(response.error) });
        }
        if (isSuccess(response)) {
            console.log(response.status);
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
        const response = await service<QuestionnaireResponse>({
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

    const getAllQuestionCount = (questionnaire: QuestionnaireItem[]) => {
        let allTypeQuestions: QuestionnaireItem[] = [];
        questionnaire.forEach((item) => {
            if (item.item) {
                allTypeQuestions = allTypeQuestions.concat(item.item);
            }
        });
        const choiceAndGroupQuestions = allTypeQuestions.filter(
            (questions) => questions.type === 'choice' || questions.type === 'group',
        );
        const choiceQuestions = [];
        choiceAndGroupQuestions.map((question) => {
            if (question.type === 'group') {
                question.item?.map((item) => {
                    choiceQuestions.push(item);
                });
            }
            if (question.type === 'choice') {
                choiceQuestions.push(question);
            }
            return question;
        });
        return choiceQuestions.length;
    };

    const [questionnaire, setQiestionnaire] = useState<QuestionnaireItem[] | undefined>([]);
    const [choices, setChoices] = useState<any[]>([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const questionCount = getAllQuestionCount(questionnaire!);
        if (questionCount > 0) {
            setProgress(Math.round((choices.length / questionCount) * 100));
        }
    }, [choices, questionnaire]);

    useEffect(() => {
        setChoices([]);
    }, [questionnaireId]);

    return { questFormRespRD, saveQR, setQiestionnaire, progress, choices, setChoices };
}
