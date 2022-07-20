import { Bundle, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

interface Props {
    data: Bundle<QuestionnaireResponse>;
}

export const QuestionnaireSummary = ({ data }: Props) => {
    const questionnaireNameExpectedList = ['personal-information', 'screening-questions'];

    if (data.entry?.length === 0) {
        return (
            <div>
                {questionnaireNameExpectedList.map((questionnaireName, key) => (
                    <div key={key}>{questionnaireName}: Incomplete</div>
                ))}
            </div>
        );
    }

    const questionnaireNameResultList: string[] = [];

    data.entry?.map((entry) => {
        const questionnaireName = entry.resource?.questionnaire;
        if (questionnaireName && questionnaireNameExpectedList.includes(questionnaireName)) {
            questionnaireNameResultList.push(questionnaireName);
        }
    });

    return (
        <div>
            {questionnaireNameExpectedList.map((questionnaireName, key) => {
                if (questionnaireNameResultList.includes(questionnaireName)) {
                    return <div key={key}>{questionnaireName}: Complete</div>;
                }
                return <div key={key}>{questionnaireName}: Incomplete</div>;
            })}
        </div>
    );
};
