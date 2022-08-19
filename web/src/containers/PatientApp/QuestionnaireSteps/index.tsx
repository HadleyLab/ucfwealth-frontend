import { Steps } from 'antd';
import { useState } from 'react';

import { Patient } from 'shared/src/contrib/aidbox';

import { QuestionnaireSuccess } from 'src/components/QuestionnaireSuccess';
import { QuestionnaireForm } from 'src/containers/PatientApp/QuestionnaireForm';

import s from './QuestionnaireSteps.module.scss';

const { Step } = Steps;

interface Props {
    patient: Patient;
    activeQuestionnaireMap: any;
    questionnaireName: string;
}

export const QuestionnaireSteps = ({
    patient,
    activeQuestionnaireMap,
    questionnaireName,
}: Props) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: 'Participant Information',
            content: (
                <QuestionnaireForm
                    patient={patient}
                    questionnaireId={activeQuestionnaireMap.personalInfo}
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
                    questionnaireId={questionnaireName}
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

    let title;

    if (questionnaireName === 'patient-report-baseline') {
        title = 'Breast Cancer research';
    }

    if (questionnaireName === 'screening-questions') {
        title = 'COVID-19 research';
    }

    return (
        <>
            <h2 className={s.title}>{title}</h2>
            <Steps current={currentStep} className={s.steps}>
                {steps.map((item) => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className={s.stepsContent}>{steps[currentStep].content}</div>
        </>
    );
};
