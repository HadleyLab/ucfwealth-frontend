import { Steps } from 'antd';
import { useState } from 'react';

import { Patient, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { QuestionnaireSuccess } from 'src/components/QuestionnaireSuccess';
import { QuestionnaireForm } from 'src/containers/PatientApp/QuestionnaireForm';

import s from './QuestionnaireSteps.module.scss';

const { Step } = Steps;

interface Props {
    patient: Patient;
    activeQuestionnaireMap: any;
    questionnaireName: string;
    questionnaireList: QuestionnaireResponse[];
}

const getDefaultStep = (questionnaireList: QuestionnaireResponse[]) => {
    if (questionnaireList.length >= 2) {
        return 2;
    }
    if (questionnaireList.length >= 1) {
        return 1;
    }
    return 0;
};

export const QuestionnaireSteps = ({
    patient,
    activeQuestionnaireMap,
    questionnaireName,
    questionnaireList,
}: Props) => {
    const [currentStep, setCurrentStep] = useState(getDefaultStep(questionnaireList));

    const steps = [
        {
            title: (
                <div
                    style={currentStep !== 0 ? { cursor: 'pointer' } : {}}
                    onClick={() => setCurrentStep(0)}
                >
                    Participant Information
                </div>
            ),
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
            title: (
                <div
                    style={
                        questionnaireList.length >= 1 && currentStep !== 1
                            ? { cursor: 'pointer' }
                            : {}
                    }
                    onClick={() => {
                        if (questionnaireList.length >= 1) {
                            setCurrentStep(1);
                        }
                    }}
                >
                    Questionnaire
                </div>
            ),
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
            title: (
                <div
                    style={
                        questionnaireList.length >= 2 && currentStep !== 2
                            ? { cursor: 'pointer' }
                            : {}
                    }
                    onClick={() => {
                        if (questionnaireList.length >= 2) {
                            setCurrentStep(2);
                        }
                    }}
                >
                    Upload files
                </div>
            ),
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
                    <Step key={item.title as any} title={item.title} />
                ))}
            </Steps>
            <div className={s.stepsContent}>{steps[currentStep].content}</div>
        </>
    );
};
