import { Button, Steps } from 'antd';
import { FormApi, Unsubscribe } from 'final-form';
import arrayMutators from 'final-form-arrays';
import _ from 'lodash';
import React, { useState } from 'react';
import { FormRenderProps } from 'react-final-form';
import { useHistory } from 'react-router-dom';

import { Questionnaire, QuestionnaireItem, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { QuestionnaireStepManager } from 'src/containers/PatientApp/QuestionnaireFormWrapper/useQuestionnaireFormWrapper';
import { SaveIcon } from 'src/images/SaveIcon';
import {
    FormItems,
    getEnabledQuestions,
    interpolateAnswers,
    mapFormToResponse,
    mapResponseToForm,
} from 'src/utils/questionnaire';

import { CustomForm } from '../CustomForm';
import s from './QuestionnaireResponseForm.module.scss';
import { RenderAnswerBoolean } from './RenderAnswerBoolean';
import { RenderAnswerChoice } from './RenderAnswerChoice';
import { RenderAnswerDateTime } from './RenderAnswerDateTime';
import { RenderAnswerNumeric } from './RenderAnswerNumeric';
import { RenderAnswerText } from './RenderAnswerText';
import { RenderGroup } from './RenderGroup';
import { RenderRepeatsAnswer } from './RenderRepeatsAnswer';

interface Props {
    resource: QuestionnaireResponse;
    questionnaire: Questionnaire;
    choices: any[];
    questionnaireId: string;
    progress: number;
    onSave: (resource: QuestionnaireResponse) => Promise<any> | void;
    questionnaireStepManager: QuestionnaireStepManager;
    setChoices: (value: any[]) => void;
    readOnly?: boolean;
    customWidgets?: {
        [linkId: string]: (
            questionItem: QuestionnaireItem,
            fieldPath: string[],
            formParams: FormRenderProps,
        ) => React.ReactNode;
    };
    onChange?: (resource: QuestionnaireResponse) => void;
}

type FormValues = FormItems;

const { Step } = Steps;

export const QuestionnaireResponseForm = ({
    resource,
    questionnaire,
    choices,
    questionnaireId,
    progress,
    onSave,
    questionnaireStepManager,
    setChoices,
    readOnly,
    customWidgets,
    onChange,
}: Props) => {
    const { stepInfo, setStepInfo } = questionnaireStepManager;

    const [currentStep, setCurrentStep] = useState(0);

    const history = useHistory();

    const addChoiceValueToProgressBar = (choice: any) => {
        if (
            !choices.find((c) => c.question === choice.question && choice !== '') &&
            questionnaire.id !== 'personal-information'
        ) {
            setChoices([...choices, choice]);
        }
    };

    const onSubmit = async (values: FormValues) => {
        const updatedResource = fromFormValues(values);
        return onSave(updatedResource);
    };

    const fromFormValues = (values: FormValues) => {
        return {
            ...resource,
            ...mapFormToResponse(values, questionnaire),
        };
    };

    const toFormValues = (): FormValues => {
        return mapResponseToForm(resource, questionnaire);
    };

    const renderRepeatsAnswer = (
        renderAnswer: (
            questionItem: QuestionnaireItem,
            parentPath: string[],
            formParams: FormRenderProps,
            index: number,
        ) => React.ReactNode,
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
    ) => {
        const { repeats } = questionItem;

        if (!repeats) {
            return renderAnswer(questionItem, parentPath, formParams, 0);
        }

        return (
            <RenderRepeatsAnswer
                formParams={formParams}
                parentPath={parentPath}
                questionItem={questionItem}
                renderAnswer={renderAnswer}
            />
        );
    };

    const renderAnswerText = (
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
        index = 0,
    ) => (
        <RenderAnswerText
            formParams={formParams}
            parentPath={parentPath}
            questionItem={questionItem}
            renderQuestions={renderQuestions}
            index={index}
        />
    );

    const renderAnswerNumeric = (
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
        index = 0,
    ) => (
        <RenderAnswerNumeric
            formParams={formParams}
            parentPath={parentPath}
            questionItem={questionItem}
            renderQuestions={renderQuestions}
            index={index}
        />
    );

    const [validDate, setValidDate] = React.useState(true);
    const [answerDateTimeChanged, setAnswerDateTimeChanged] = React.useState(false);

    const renderAnswerDateTime = (
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
        index = 0,
    ) => (
        <RenderAnswerDateTime
            formParams={formParams}
            parentPath={parentPath}
            questionItem={questionItem}
            renderQuestions={renderQuestions}
            index={index}
            validDate={validDate}
            setValidDate={setValidDate}
            answerDateTimeChanged={answerDateTimeChanged}
            setAnswerDateTimeChanged={setAnswerDateTimeChanged}
        />
    );

    const renderGroup = (
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
        // fieldsRenderConfig: FieldsRenderConfig,
    ) => (
        <RenderGroup
            formParams={formParams}
            parentPath={parentPath}
            questionItem={questionItem}
            renderQuestions={renderQuestions}
        />
    );

    const renderAnswer = (
        rawQuestionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
    ) => {
        const questionItem = {
            ...rawQuestionItem,
            text: interpolateAnswers(rawQuestionItem.text!, parentPath, formParams.values),
        };
        const { type } = questionItem;

        if (type === 'string' || type === 'text') {
            return renderRepeatsAnswer(renderAnswerText, questionItem, parentPath, formParams);
        }

        if (type === 'integer' || type === 'decimal') {
            return renderRepeatsAnswer(renderAnswerNumeric, questionItem, parentPath, formParams);
        }

        if (type === 'date' || type === 'dateTime') {
            return renderRepeatsAnswer(renderAnswerDateTime, questionItem, parentPath, formParams);
        }

        if (type === 'choice') {
            return (
                <RenderAnswerChoice
                    questionItem={questionItem}
                    parentPath={parentPath}
                    formParams={formParams}
                    addChoiceValueToProgressBar={addChoiceValueToProgressBar}
                    renderQuestions={renderQuestions}
                />
            );
        }

        if (type === 'display') {
            return <div>{questionItem.text}</div>;
        }

        if (type === 'group') {
            return renderGroup(questionItem, parentPath, formParams);
        }

        if (type === 'boolean') {
            return (
                <RenderAnswerBoolean
                    questionItem={questionItem}
                    parentPath={parentPath}
                    addChoiceValueToProgressBar={addChoiceValueToProgressBar}
                />
            );
        }

        console.error(`TODO: Unsupported item type ${type}`);

        return null;
    };

    const renderQuestions = (
        items: QuestionnaireItem[],
        parentPath: string[],
        formParams: FormRenderProps,
    ) => {
        return _.map(getEnabledQuestions(items, parentPath, formParams.values), (item, index) => (
            <div key={index}>{renderAnswer(item, parentPath, formParams)}</div>
        ));
    };

    const renderForm = (items: QuestionnaireItem[], formParams: FormRenderProps) => {
        const { submitting, valid, handleSubmit } = formParams;

        const isLastStep = currentStep === items.length - 1;

        const isValid = valid && validDate && typeof stepInfo.currentStep === 'number';

        const onSaveContinue = async () => {
            if (!isLastStep) {
                setCurrentStep(currentStep + 1);
                return;
            }

            if (!isValid) return;

            await handleSubmit();
            setAnswerDateTimeChanged(true);

            if (stepInfo.currentStep === 2) {
                history.push('/app/summary-overview');
            } else {
                setStepInfo({
                    ...stepInfo,
                    currentStep: stepInfo.currentStep + 1,
                    stepAccess: {
                        completedQuestionnaires: stepInfo.stepAccess.completedQuestionnaires + 1,
                        uploadedFiles: stepInfo.stepAccess.uploadedFiles,
                    },
                });
            }
        };

        const onPrevious = () => {
            setCurrentStep(currentStep - 1);
        };

        const onNext = () => {
            if (!isValid) return;
            setCurrentStep(currentStep + 1);
        };

        return (
            <>
                {items.length > 1 ? (
                    <Steps current={currentStep} className={s.steps}>
                        {items.map((_, index) => (
                            <Step key={index} title={`Step ${index + 1}`} />
                        ))}
                    </Steps>
                ) : null}
                {items[currentStep] && renderQuestions([items[currentStep]], [], formParams)}
                <>
                    {currentStep > 0 && (
                        <Button className={s.stepButton} onClick={onPrevious}>
                            Previous
                        </Button>
                    )}
                    {currentStep < items.length - 1 ? (
                        <Button type="primary" className={s.stepButton} onClick={onNext}>
                            Next
                        </Button>
                    ) : !readOnly && isLastStep ? (
                        <Button
                            type="primary"
                            className={s.stepButton}
                            disabled={submitting}
                            onClick={onSaveContinue}
                        >
                            <SaveIcon className={s.saveIcon} />
                            <span>Save and Continue</span>
                        </Button>
                    ) : null}
                </>
            </>
        );
    };

    const onFormChange = (form: FormApi<FormValues>): Unsubscribe => {
        const unsubscribe = form.subscribe(
            ({ values }) => {
                if (onChange) {
                    if (!_.isEqual(values, toFormValues())) {
                        const updatedResource = fromFormValues(values);
                        onChange(updatedResource);
                    }
                }
            },
            { values: true },
        );

        return () => {
            unsubscribe();
        };
    };

    return (
        <CustomForm<FormValues>
            onSubmit={onSubmit}
            layout={'vertical'}
            initialValues={toFormValues()}
            initialValuesEqual={_.isEqual}
            decorators={[onFormChange]}
            mutators={{ ...arrayMutators }}
        >
            {(params) => {
                if (!questionnaire.item) {
                    console.error('questionnaire item is missing', questionnaire.item);
                    return;
                }
                const items = getEnabledQuestions(questionnaire.item, [], params.values);
                return renderForm(items, params);
            }}
        </CustomForm>
    );
};
