import { Questionnaire, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

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
                <div key={questionnaire.id}>
                    {questionnaire.title}: {questionnaire.result ? 'Complete' : 'Incomplete'}
                </div>
            );
        });
    };

    return <div>{renderQuestionnaireSummary()}</div>;
};
