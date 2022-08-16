import { Select } from 'antd';
import { useState } from 'react';

import { Patient } from 'shared/src/contrib/aidbox';

import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { useActiveQuestionnaireList } from 'src/containers/SuperAdminApp/QuestionnaireAvailableBadge/useActiveQuestionnaireList';

import { QuestionnaireSteps } from '../QuestionnaireSteps';

interface QuestionnaireFormWrapperProps {
    patient: Patient;
}

export const QuestionnaireFormWrapper = ({ patient }: QuestionnaireFormWrapperProps) => {
    const { activeQuestionnaireListRD } = useActiveQuestionnaireList();
    const [questionnaireSelected, setQuestionnaireSelected] = useState('');

    return (
        <RenderRemoteData remoteData={activeQuestionnaireListRD}>
            {(activeQuestionnaireMap) => {
                const questionnaireNameExpectedList = [
                    ...activeQuestionnaireMap.questionnaireList.split(' '),
                ];

                return (
                    <>
                        {questionnaireSelected !== '' ? (
                            <QuestionnaireSteps
                                patient={patient}
                                activeQuestionnaireMap={activeQuestionnaireMap}
                                questionnaireName={questionnaireSelected}
                            />
                        ) : (
                            <SelectComponent
                                questionnaireNameExpectedList={questionnaireNameExpectedList}
                                setQuestionnaireSelected={setQuestionnaireSelected}
                            />
                        )}
                    </>
                );
            }}
        </RenderRemoteData>
    );
};

interface SelectComponentProps {
    questionnaireNameExpectedList: string[];
    setQuestionnaireSelected: (questionnaireName: string) => void;
}

const SelectComponent = ({
    questionnaireNameExpectedList,
    setQuestionnaireSelected,
}: SelectComponentProps) => {
    const { Option } = Select;

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
        setQuestionnaireSelected(value);
    };

    return (
        <Select
            defaultValue={'select questionnaire'}
            style={{ width: 500 }}
            onChange={handleChange}
        >
            {questionnaireNameExpectedList.map((questionnaireName) => (
                <Option value={questionnaireName}>{questionnaireName}</Option>
            ))}
        </Select>
    );
};
