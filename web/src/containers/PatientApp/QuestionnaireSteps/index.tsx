import { Steps } from 'antd';
import { useEffect } from 'react';

import { Patient, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { UploadFile } from 'src/components/UploadFile';
import { QuestionnaireForm } from 'src/containers/PatientApp/QuestionnaireForm';
import { QuestionnaireStepManager } from 'src/containers/PatientApp/QuestionnaireFormWrapper/useQuestionnaireFormWrapper';

import s from './QuestionnaireSteps.module.scss';

const { Step } = Steps;

interface Props {
    patient: Patient;
    questionnaireName: string;
    questionnaireResponseList: QuestionnaireResponse[];
    dicomContentList: string[];
    questionnaireStepManager: QuestionnaireStepManager;
    isSaveDisabled?: boolean;
}

export const QuestionnaireSteps = ({
    patient,
    questionnaireName,
    questionnaireResponseList,
    dicomContentList,
    questionnaireStepManager,
    isSaveDisabled,
}: Props) => {
    const { stepInfo, uploadImageStep, setStepInfo, onContinue, getDefaultStep } =
        questionnaireStepManager;
    const steps = [
        {
            title: (
                <div
                    style={stepInfo.currentStep !== 0 ? { cursor: 'pointer' } : {}}
                    onClick={() =>
                        setStepInfo({
                            ...stepInfo,
                            currentStep: 0,
                        })
                    }
                >
                    Participant Information
                </div>
            ),
            content: (
                <QuestionnaireForm
                    patient={patient}
                    questionnaireId={'personal-information'}
                    questionnaireStepManager={questionnaireStepManager}
                    isSaveDisabled={isSaveDisabled}
                />
            ),
        },
        {
            title: (
                <div
                    style={
                        stepInfo.stepAccess.completedQuestionnaires >= 1 &&
                        stepInfo.currentStep !== 1
                            ? { cursor: 'pointer' }
                            : {}
                    }
                    onClick={() => {
                        if (stepInfo.stepAccess.completedQuestionnaires >= 1) {
                            setStepInfo({
                                ...stepInfo,
                                currentStep: 1,
                            });
                        }
                    }}
                >
                    Upload files
                </div>
            ),
            content: <UploadFile onContinue={onContinue} />,
        },

        {
            title: (
                <div
                    style={
                        stepInfo.stepAccess.completedQuestionnaires >= 1 &&
                        stepInfo.stepAccess.uploadedFiles > 0 &&
                        stepInfo.currentStep !== 2
                            ? { cursor: 'pointer' }
                            : {}
                    }
                    onClick={() => {
                        if (
                            stepInfo.stepAccess.completedQuestionnaires >= 1 &&
                            stepInfo.stepAccess.uploadedFiles > 0
                        ) {
                            setStepInfo({
                                ...stepInfo,
                                currentStep: 2,
                            });
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
                    questionnaireStepManager={questionnaireStepManager}
                    isSaveDisabled={isSaveDisabled}
                />
            ),
        },
    ];

    let title;
    if (questionnaireName === 'patient-report-baseline') {
        title = 'Breast Cancer research';
    } else if (questionnaireName === 'screening-questions') {
        title = 'COVID-19 research';
    } else if (questionnaireName === 'survival-and-disease-control') {
        title = 'Survival and Disease control';
    }

    useEffect(() => {
        if (stepInfo.firstStepLoad) {
            setStepInfo({
                currentStep: getDefaultStep(questionnaireResponseList, dicomContentList),
                firstStepLoad: false,
                stepAccess: {
                    completedQuestionnaires: questionnaireResponseList.length,
                    uploadedFiles: dicomContentList.length,
                },
            });
        }
    }, [stepInfo.firstStepLoad]);

    return (
        <>
            <h2 className={s.title}>{title}</h2>
            {!uploadImageStep ? (
                <Steps current={stepInfo.currentStep} className={s.steps}>
                    {steps.map((item, index) => (
                        <Step key={index} title={item.title} />
                    ))}
                </Steps>
            ) : null}
            <div className={s.stepsContent}>{steps[stepInfo.currentStep].content}</div>
        </>
    );
};
