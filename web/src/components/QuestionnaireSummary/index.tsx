import { Questionnaire, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { CompleteStatus } from 'src/components/CompleteStatus';
import { questionnaireNameList } from 'src/config.questionnaire';

import s from './QuestionnaireSummary.module.scss';

interface QuestionnaireListMap {
    questionnaireList: Questionnaire[];
    questionnaireResponseList: QuestionnaireResponse[];
}

interface Props {
    questionnaireListMap: QuestionnaireListMap;
    getQuestionnaireSummary: (
        questionnaireListMap: QuestionnaireListMap,
        questionnaireNameExpectedList: string[],
    ) => {
        [key: string]: {
            id: string;
            title: string;
            result: boolean;
        };
    };
}

export const QuestionnaireSummary = ({ questionnaireListMap, getQuestionnaireSummary }: Props) => {
    const questionnaireNameExpectedList = questionnaireNameList;

    const questionnaireSummary = getQuestionnaireSummary(questionnaireListMap, questionnaireNameExpectedList);

    const renderQuestionnaireSummary = () => {
        return Object.keys(questionnaireSummary).map((key) => {
            const questionnaire = questionnaireSummary[key];
            return (
                <div key={questionnaire.id} className={s.questionnaireSummary}>
                    <div className={s.title}>{questionnaire.title}:</div> <CompleteStatus status={questionnaire.result} />
                </div>
            );
        });
    };

    return <div>{renderQuestionnaireSummary()}</div>;
};
