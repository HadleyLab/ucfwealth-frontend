import { Questionnaire, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { CompleteStatus } from 'src/components/CompleteStatus';

import s from './QuestionnaireSummary.module.scss';

interface Data {
    questionnaireList: Questionnaire[];
    questionnaireResponseList: QuestionnaireResponse[];
}

interface Props {
    data: Data;
    getQuestionnaireSummary: (
        data: Data,
        questionnaireNameExpectedList: string[],
    ) => {
        [key: string]: {
            id: string;
            title: string;
            result: boolean;
        };
    };
}

export const QuestionnaireSummary = ({ data, getQuestionnaireSummary }: Props) => {
    const questionnaireNameExpectedList = ['personal-information', 'screening-questions'];

    const questionnaireSummary = getQuestionnaireSummary(data, questionnaireNameExpectedList);

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
