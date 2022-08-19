import { Button } from 'antd';

import { Questionnaire, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { CompleteStatus } from 'src/components/CompleteStatus';
import { RenderRemoteData } from 'src/components/RenderRemoteData';

import { useQuestionnaireSummary } from './useQuestionnaireSummary';

interface QuestionnaireListMap {
    questionnaireList: Questionnaire[];
    questionnaireResponseList: QuestionnaireResponse[];
}

type GetQuestionnaireSummary = (
    questionnaireListMap: QuestionnaireListMap,
    questionnaireNameExpectedList: string[],
) => {
    [key: string]: {
        id: string;
        title: string;
        result: boolean;
    };
};

interface Props {
    questionnaireListMap: QuestionnaireListMap;
    getQuestionnaireSummary: GetQuestionnaireSummary;
    patientId: string;
    goToQuestionnaire: () => void;
}

export const QuestionnaireSummary = ({
    questionnaireListMap,
    getQuestionnaireSummary,
    patientId,
    goToQuestionnaire,
}: Props) => {
    const { settingsMapRD } = useQuestionnaireSummary({ patientId });

    return (
        <RenderRemoteData remoteData={settingsMapRD}>
            {(settingsMap) => {
                const questionnaireNameExpectedList = [
                    settingsMap.activeQuestionnaireMap.personalInfo,
                    ...settingsMap.activeQuestionnaireMap.questionnaireList.split(' '),
                ];
                const questionnaireSummary = getQuestionnaireSummary(
                    questionnaireListMap,
                    questionnaireNameExpectedList,
                );
                if (settingsMap.patientSettings?.selectedQuestionnaire) {
                    const questionnaireResult = Object.fromEntries(
                        Object.entries(questionnaireSummary).filter(([id]) => {
                            return (
                                id === settingsMap.activeQuestionnaireMap.personalInfo ||
                                id === settingsMap.patientSettings?.selectedQuestionnaire
                            );
                        }),
                    );
                    return (
                        <div>
                            {Object.keys(questionnaireResult).map((key) => {
                                const questionnaire = questionnaireResult[key];
                                return <CompleteStatus questionnaire={questionnaire} />;
                            })}
                        </div>
                    );
                }
                return (
                    <Button onClick={goToQuestionnaire} type="primary">
                        Join the research to see progress
                    </Button>
                );
            }}
        </RenderRemoteData>
    );
};
