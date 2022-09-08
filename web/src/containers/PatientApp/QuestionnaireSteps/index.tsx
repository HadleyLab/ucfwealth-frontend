import { Steps } from 'antd';
import { useState } from 'react';

import { Patient, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { QuestionnaireSuccess } from 'src/components/QuestionnaireSuccess';
import { QuestionnaireForm } from 'src/containers/PatientApp/QuestionnaireForm';

import s from './QuestionnaireSteps.module.scss';

const { Step } = Steps;

interface Props {
    patient: Patient;
    questionnaireName: string;
    questionnaireResponseList: QuestionnaireResponse[];
    isSaveDisabled?: boolean;
}

const getDefaultStep = (questionnaireResponseList: QuestionnaireResponse[]) => {
    if (questionnaireResponseList.length >= 2) {
        return 2;
    }
    if (questionnaireResponseList.length >= 1) {
        return 1;
    }
    return 0;
};

export const QuestionnaireSteps = ({
    patient,
    questionnaireName,
    questionnaireResponseList,
    isSaveDisabled
}: Props) => {
    const [currentStep, setCurrentStep] = useState(getDefaultStep(questionnaireResponseList));

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
                    questionnaireId={'personal-information'}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    isSaveDisabled={isSaveDisabled}
                />
            ),
        },
        {
            title: (
                <div
                    style={
                        questionnaireResponseList.length >= 1 && currentStep !== 1
                            ? { cursor: 'pointer' }
                            : {}
                    }
                    onClick={() => {
                        if (questionnaireResponseList.length >= 1) {
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
                    isSaveDisabled={isSaveDisabled}
                />
            ),
        },
        {
            title: (
                <div
                    style={
                        questionnaireResponseList.length >= 2 && currentStep !== 2
                            ? { cursor: 'pointer' }
                            : {}
                    }
                    onClick={() => {
                        if (questionnaireResponseList.length >= 2) {
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
