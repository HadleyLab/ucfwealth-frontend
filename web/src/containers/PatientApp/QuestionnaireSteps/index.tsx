import { Steps } from 'antd';
import { useState } from 'react';

import { Patient } from 'shared/src/contrib/aidbox';

import { QuestionnaireSuccess } from 'src/components/QuestionnaireSuccess';
import { questionnaireNameList, questionnaireTitle } from 'src/config.questionnaire';
import { QuestionnaireForm } from 'src/containers/PatientApp/QuestionnaireForm';

import s from './QuestionnaireSteps.module.scss';

const { Step } = Steps;

interface Props {
    isSuccessQuestionnaire: boolean;
    patient: Patient;
    setIsSuccessQuestionnaire: (state: boolean) => void;
}

export const QuestionnaireSteps = ({ patient }: Props) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: 'Participant Information',
            content: (
                <QuestionnaireForm
                    patient={patient}
                    questionnaireId={questionnaireNameList[0]}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                />
            ),
        },
        {
            title: 'Questionnaire',
            content: (
                <QuestionnaireForm
                    patient={patient}
                    questionnaireId={questionnaireNameList[1]}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                />
            ),
        },
        {
            title: 'Complete',
            content: <QuestionnaireSuccess />,
        },
    ];

    return (
        <>
            <h2 className={s.title}>{questionnaireTitle}</h2>
            <Steps current={currentStep} className={s.steps}>
                {steps.map((item) => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className={s.stepsContent}>{steps[currentStep].content}</div>
        </>
    );
};
