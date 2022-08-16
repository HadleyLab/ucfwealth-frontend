import { Questionnaire, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { CompleteStatus } from 'src/components/CompleteStatus';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { useActiveQuestionnaireList } from 'src/containers/SuperAdminApp/QuestionnaireAvailableBadge/useActiveQuestionnaireList';

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
    const { activeQuestionnaireListRD } = useActiveQuestionnaireList();

    return (
        <RenderRemoteData remoteData={activeQuestionnaireListRD}>
            {(data) => {
                const questionnaireNameExpectedList = [
                    data.personalInfo,
                    ...data.questionnaireList.split(' '),
                ];

                const questionnaireSummary = getQuestionnaireSummary(
                    questionnaireListMap,
                    questionnaireNameExpectedList,
                );

                return (
                    <div>
                        {Object.keys(questionnaireSummary).map((key) => {
                            const questionnaire = questionnaireSummary[key];
                            return <CompleteStatus questionnaire={questionnaire} />;
                        })}
                    </div>
                );
            }}
        </RenderRemoteData>
    );
};
