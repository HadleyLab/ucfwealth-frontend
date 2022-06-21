import { Button, Steps } from 'antd';
import React, { useState } from 'react';

import { Patient } from 'shared/src/contrib/aidbox';

import { QuestionnaireSuccess } from 'src/components/QuestionnaireSuccess';

import { QuestionnaireForm } from '../QuestionnaireForm';
import s from './QuestionnaireSteps.module.scss';

const { Step } = Steps;

interface Props {
    isSuccessQuestionnaire: boolean;
    setIsSuccessQuestionnaire: (state: boolean) => void;
    patient: Patient;
}

export const QuestionnaireSteps = ({
    patient,
}: Props) => {
    const [current, setCurrent] = useState(0);
    const [formParams, setFormParams] = useState<any>(false);

    const next = async () => {
        const { handleSubmit } = formParams;
        await handleSubmit();
        setCurrent(current + 1);
        setFormParams(false);
    };

    const steps = [
        {
            title: 'Participant Information',
            content: (
                <QuestionnaireForm
                    patient={patient}
                    questionnaireId={'personal-information'}
                    setFormParams={setFormParams}
                    formParams={formParams}
                />
            ),
        },
        {
            title: 'Questionnaire',
            content: (
                <QuestionnaireForm
                    patient={patient}
                    questionnaireId={'screening-questions'}
                    setFormParams={setFormParams}
                    formParams={formParams}
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
            <Steps current={current}>
                {steps.map((item) => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className={s.stepsContent}>{steps[current].content}</div>
            <div className={s.stepsAction}>
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={next}>
                        Next
                    </Button>
                )}
            </div>
        </>
    );
};
