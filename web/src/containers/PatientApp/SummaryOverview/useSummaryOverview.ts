import { useHistory } from 'react-router-dom';

import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure } from 'aidbox-react/src/libs/remoteData';
import { extractBundleResources, getFHIRResources, WithId } from 'aidbox-react/src/services/fhir';
import { mapSuccess, sequenceMap, service } from 'aidbox-react/src/services/service';

import { Questionnaire, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { sharedPatientId } from 'src/sharedState';

const getQuestionnaireSummary = (
    questionnaireListMap: {
        questionnaireList: Questionnaire[];
        questionnaireResponseList: QuestionnaireResponse[];
    },
    questionnaireNameExpectedList: string[],
) => {
    const questionnaireList = questionnaireListMap.questionnaireList.filter(
        (questionnaire) =>
            questionnaire.id && questionnaireNameExpectedList.includes(questionnaire.id),
    );

    const questionnaireResponseList = questionnaireListMap.questionnaireResponseList.filter(
        (questionnaireResponse) =>
            questionnaireResponse.questionnaire &&
            questionnaireNameExpectedList.includes(questionnaireResponse.questionnaire),
    );

    const questionnaireMap = questionnaireNameExpectedList.reduce((acc, questionnaireName) => {
        const questionnaire = questionnaireList.find(
            (questionnaire) => questionnaire.id === questionnaireName,
        );
        const questionnaireResponse = questionnaireResponseList.find(
            (questionnaireResponse) => questionnaireResponse.questionnaire === questionnaireName,
        );
        if (questionnaire && questionnaireResponse) {
            acc[questionnaireName] = {
                id: questionnaire.id || '',
                title: questionnaire.title || '',
                result: questionnaireResponse.questionnaire === questionnaire.id,
            };
        } else {
            acc[questionnaireName] = {
                id: questionnaire?.id || '',
                title: questionnaire?.title || '',
                result: false,
            };
        }
        return acc;
    }, {} as { [key: string]: { id: string; title: string; result: boolean } });

    return questionnaireMap;
};

export const useSummaryOverview = () => {
    const patientId = sharedPatientId.getSharedState().id;

    const [fileListRD] = useService(async () => {
        const response = await service({
            method: 'GET',
            url: '$list-patient-dicom-files',
            params: {
                patientId,
            },
        });
        if (isFailure(response)) {
            console.error(response.error);
        }
        return response;
    });

    const [questionnaireResponseListRD] = useService(async () => {
        const response = await service({
            method: 'GET',
            url: `QuestionnaireResponse?_ilike=${patientId}`,
        });
        if (isFailure(response)) {
            console.error(response.error);
        }
        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle)
                .QuestionnaireResponse as WithId<QuestionnaireResponse>[];
        });
    });

    const [questionnaireListRD] = useService(async () => {
        const response = await getFHIRResources<Questionnaire>('Questionnaire', {});
        if (isFailure(response)) {
            console.error(response.error);
        }
        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).Questionnaire;
        });
    });

    const questionnaireListMapRD = sequenceMap({
        questionnaireList: questionnaireListRD,
        questionnaireResponseList: questionnaireResponseListRD,
    });

    const history = useHistory();
    const goToQuestionnaire = () => history.push({ pathname: `/app/questionnaire` });

    return {
        fileListRD,
        questionnaireListMapRD,
        patientId,
        goToQuestionnaire,
        getQuestionnaireSummary,
    };
};
