import { Button, DatePicker } from 'antd';
import { FormApi, Unsubscribe } from 'final-form';
import arrayMutators from 'final-form-arrays';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Field, FormRenderProps } from 'react-final-form';

import { Questionnaire, QuestionnaireItem, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { InputField } from 'src/components/fields';
import { SaveIcon } from 'src/images/SaveIcon';
import {
    FormAnswerItems,
    FormItems,
    getDisplay,
    getEnabledQuestions,
    interpolateAnswers,
    isValueEqual,
    mapFormToResponse,
    mapResponseToForm,
} from 'src/utils/questionnaire';

import { CustomForm } from '../CustomForm';
import { ChooseField } from '../fields/ChooseField';
import { QuestionnaireProgress } from '../QuestionnaireProgress';
import s from './QuestionnaireResponseForm.module.scss';

interface Props {
    resource: QuestionnaireResponse;
    questionnaire: Questionnaire;
    customWidgets?: {
        [linkId: string]: (
            questionItem: QuestionnaireItem,
            fieldPath: string[],
            formParams: FormRenderProps,
        ) => React.ReactNode;
    };
    readOnly?: boolean;
    choices: any[];
    currentStep: number;
    questionnaireId: string;
    progress: number;
    onSave: (resource: QuestionnaireResponse) => Promise<any> | void;
    onChange?: (resource: QuestionnaireResponse) => void;
    setChoices: (value: any[]) => void;
    setCurrentStep: (value: React.SetStateAction<number>) => void;
}

type FormValues = FormItems;

export const QuestionnaireResponseForm = (props: Props) => {
    const addChoiceValueToProgressBar = (choice: any) => {
        const choices = props.choices;
        if (
            !choices.find((c) => c.question === choice.question && choice !== '') &&
            props.questionnaire.id !== 'personal-information'
        ) {
            props.setChoices([...choices, choice]);
        }
    };

    const onSave = async (values: FormValues) => {
        const { onSave } = props;
        const updatedResource = fromFormValues(values);
        return onSave(updatedResource);
    };

    const fromFormValues = (values: FormValues) => {
        const { questionnaire, resource } = props;
        return {
            ...resource,
            ...mapFormToResponse(values, questionnaire),
        };
    };

    const toFormValues = (): FormValues => {
        const { resource, questionnaire } = props;
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
        const { linkId, text, required, repeats } = questionItem;
        const baseFieldPath = [...parentPath, linkId];

        if (!repeats) {
            return renderAnswer(questionItem, parentPath, formParams, 0);
        }

        if (!required) {
            console.error('TODO: Unsupported question which is not required and repeats');
        }

        return (
            <Field name={baseFieldPath.join('.')}>
                {({ input }) => {
                    return (
                        <div>
                            <div>{text}</div>

                            {_.map(
                                input.value.length ? input.value : [{}],
                                (elem, index: number) => {
                                    if (index > 0 && !input.value[index]) {
                                        return null;
                                    }

                                    return (
                                        <div key={`repeatsAnswer-${index}`} className="d-flex">
                                            <div className="flex-grow-1">
                                                {renderAnswer(
                                                    questionItem,
                                                    parentPath,
                                                    formParams,
                                                    index,
                                                )}
                                            </div>
                                            {index > 0 ? (
                                                <div
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                    onClick={() =>
                                                        input.onChange(
                                                            _.filter(
                                                                input.value,
                                                                (val, valIndex: number) =>
                                                                    valIndex !== index,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    Delete{' '}
                                                </div>
                                            ) : (
                                                <div style={{ width: 40 }} />
                                            )}
                                        </div>
                                    );
                                },
                            )}
                            <Button
                                onClick={() =>
                                    input.onChange(
                                        input.value.length ? [...input.value, {}] : [{}, {}],
                                    )
                                }
                            >
                                Add another answer
                            </Button>
                        </div>
                    );
                }}
            </Field>
        );
    };

    const renderAnswerText = (
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
        index = 0,
    ) => {
        const { linkId, text, item, required, hidden } = questionItem;
        const fieldPath = [...parentPath, linkId, _.toString(index)];
        const name = [...fieldPath, 'value', 'string'].join('.');

        return (
            <div className={s.inputField} style={hidden ? { opacity: '0.3' } : {}}>
                <Field name={name}>
                    {({ input, meta }) => {
                        const inputProps = {
                            ...input,
                            ...(hidden ? { disabled: true } : {}),
                        };
                        return (
                            <InputField
                                name={name}
                                input={inputProps}
                                meta={meta}
                                label={text}
                                fieldProps={{
                                    validate: required
                                        ? (inputValue: any) =>
                                              _.isUndefined(inputValue) ? 'Required' : undefined
                                        : undefined,
                                }}
                            />
                        );
                    }}
                </Field>
                {item ? renderQuestions(item, [...fieldPath, 'items'], formParams) : null}
            </div>
        );
    };

    const renderAnswerNumeric = (
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
        index = 0,
    ) => {
        const { linkId, text, type, item, required, hidden } = questionItem;
        const fieldPath = [...parentPath, linkId, _.toString(index)];

        const inputFieldPath = [...fieldPath, 'value', type];

        return (
            <div className={s.inputField}>
                <InputField
                    name={inputFieldPath.join('.')}
                    fieldProps={{
                        parse: (value: any) =>
                            value
                                ? type === 'integer'
                                    ? _.parseInt(value)
                                    : parseFloat(value)
                                : undefined,
                        validate: required
                            ? (inputValue: any) =>
                                  _.isUndefined(inputValue) ? 'Required' : undefined
                            : undefined,
                    }}
                    type="number"
                    label={text}
                    disabled={hidden}
                    // helpText={helpText}
                    // addonAfter={unit && unit.display!}
                />
                {item ? renderQuestions(item, [...fieldPath, 'items'], formParams) : null}
            </div>
        );
    };

    const [validDate, setValidDate] = React.useState(true);
    const [answerDateTimeChanged, setAnswerDateTimeChanged] = React.useState(false);

    const renderAnswerDateTime = (
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
        index = 0,
    ) => {
        const { linkId, text, item } = questionItem;
        const fieldPath = [...parentPath, linkId, _.toString(index)];
        const dateFormat = 'YYYY-MM-DD';
        return (
            <>
                <Field name={[...fieldPath, 'value', 'date'].join('.')}>
                    {({ input, meta }) => {
                        if (!input.value) {
                            setValidDate(false);
                        }
                        return (
                            <div className={s.datepicker}>
                                <div className={s.inputField} style={{ marginBottom: 8 }}>
                                    {text}
                                </div>
                                <DatePicker
                                    defaultValue={input.value && moment(input.value, dateFormat)}
                                    onChange={(date, dateString) => {
                                        setAnswerDateTimeChanged(true);
                                        if (!dateString || dateString === '') {
                                            setValidDate(false);
                                        } else {
                                            input.onChange(dateString);
                                            setValidDate(true);
                                        }
                                    }}
                                    format={dateFormat}
                                    status={!validDate && answerDateTimeChanged ? 'error' : ''}
                                />
                                {!validDate && answerDateTimeChanged ? (
                                    <div className={s.requiredRed}>Required</div>
                                ) : !answerDateTimeChanged ? (
                                    <div className={s.requiredGrey}>Required</div>
                                ) : (
                                    <div style={{ height: '27px' }} />
                                )}
                            </div>
                        );
                    }}
                </Field>
                {item ? renderQuestions(item, [...fieldPath, 'items'], formParams) : null}
            </>
        );
    };

    const renderAnswerChoice = (
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
    ) => {
        const { linkId, text, answerOption, item, repeats, required } = questionItem;
        const fieldPath = [...parentPath, linkId, ...(repeats ? [] : ['0'])];
        const fieldName = fieldPath.join('.');

        return (
            <ChooseField<FormAnswerItems>
                name={fieldName}
                label={<div className={s.chooseFieldLabel}>{text}</div>}
                multiple={repeats}
                inline={!item && !repeats}
                options={_.map(answerOption, (opt) => ({
                    value: { value: opt.value },
                    label: getDisplay(opt.value),
                }))}
                fieldProps={{
                    validate: required
                        ? (inputValue: any) => {
                              if (repeats) {
                                  if (!inputValue?.length) {
                                      return 'Choose at least one option';
                                  }
                              } else {
                                  if (!inputValue) {
                                      return 'Required';
                                  }
                              }

                              return undefined;
                          }
                        : undefined,
                }}
                isEqual={(value1: any, value2: any) => isValueEqual(value1.value, value2.value)}
                renderOptionContent={(option, index, value) => {
                    const selectedIndex = _.findIndex(
                        _.isArray(value) ? value : [value],
                        (answer) => isValueEqual(answer.value, option.value.value),
                    );
                    selectedIndex === 0
                        ? addChoiceValueToProgressBar({ question: questionItem.text, ...value })
                        : null;
                    if (item && selectedIndex !== -1) {
                        const subItemParentPath = [
                            ...fieldPath,
                            ...(repeats ? [_.toString(selectedIndex)] : []),
                            'items',
                        ];
                        return renderQuestions(item, subItemParentPath, formParams);
                    }
                    return null;
                }}
            />
        );
    };

    const renderGroup = (
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
        // fieldsRenderConfig: FieldsRenderConfig,
    ) => {
        const { linkId, item, text, repeats } = questionItem;

        if (item) {
            const baseFieldPath = [...parentPath, linkId];

            if (repeats) {
                return (
                    <Field name={baseFieldPath.join('.')}>
                        {({ input }) => {
                            return (
                                <div>
                                    <p>{text}</p>
                                    <div>
                                        {_.map(
                                            input.value.items && input.value.items.length
                                                ? input.value.items
                                                : [{}],
                                            (_elem, index: number) => {
                                                if (index > 0 && !input.value.items[index]) {
                                                    return null;
                                                }
                                                return (
                                                    <div key={`group-${index}`}>
                                                        <div>
                                                            <span>{`${questionItem.text} #${
                                                                index + 1
                                                            }`}</span>
                                                            <div
                                                                onClick={() => {
                                                                    const filteredArray = _.filter(
                                                                        input.value.items,
                                                                        (_val, valIndex: number) =>
                                                                            valIndex !== index,
                                                                    );
                                                                    input.onChange({
                                                                        items: [...filteredArray],
                                                                    });
                                                                }}
                                                            >
                                                                <span>Remove</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {renderQuestions(
                                                                item,
                                                                [
                                                                    ...parentPath,
                                                                    linkId,
                                                                    'items',
                                                                    index.toString(),
                                                                ],
                                                                formParams,
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                    <div
                                        onClick={() => {
                                            const existingItems = input.value.items || [];
                                            const updatedInput = { items: [...existingItems, {}] };
                                            input.onChange(updatedInput);
                                        }}
                                    >
                                        <p>{`+ Add another ${text}`}</p>
                                    </div>
                                </div>
                            );
                        }}
                    </Field>
                );
            }
            const paragraphs = _.split(text, '\n');
            return (
                <div style={{ paddingBottom: 10, textAlign: 'left', whiteSpace: 'initial' }}>
                    {_.map(paragraphs, (paragraph, index) => {
                        return (
                            <p key={`group-paragraph-${index}`} className={s.groupParagraph}>
                                {paragraph}
                            </p>
                        );
                    })}
                    {renderQuestions(item, [...parentPath, linkId, 'items'], formParams)}
                </div>
            );
        }
        return null;
    };

    const renderAnswer = (
        rawQuestionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
    ) => {
        const questionItem = {
            ...rawQuestionItem,
            text: interpolateAnswers(rawQuestionItem.text!, parentPath, formParams.values),
        };
        // const { linkId, type, item, text } = questionItem;
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
            return renderAnswerChoice(questionItem, parentPath, formParams);
        }

        if (type === 'display') {
            return <div>{questionItem.text}</div>;
        }

        if (type === 'group') {
            return renderGroup(questionItem, parentPath, formParams);
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
        const { readOnly } = props;
        const { submitting, valid, handleSubmit } = formParams;

        const onClick = async () => {
            await handleSubmit();
            setAnswerDateTimeChanged(true);
            if (valid && validDate) props.setCurrentStep(props.currentStep + 1);
        };

        return (
            <>
                {renderQuestions(items, [], formParams)}
                {props.questionnaireId === 'screening-questions' && (
                    <QuestionnaireProgress progress={props.progress} />
                )}
                {!readOnly && (
                    <div className="questionnaire-form-actions">
                        <Button
                            type="primary"
                            className={s.saveButton}
                            disabled={submitting}
                            onClick={onClick}
                        >
                            <SaveIcon style={{ marginRight: 9 }} />
                            <span>Save and Continue</span>
                        </Button>
                    </div>
                )}
            </>
        );
    };

    const onFormChange = (form: FormApi<FormValues>): Unsubscribe => {
        const unsubscribe = form.subscribe(
            ({ values }) => {
                const { onChange } = props;
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
            onSubmit={onSave}
            layout={'vertical'}
            initialValues={toFormValues()}
            initialValuesEqual={_.isEqual}
            decorators={[onFormChange]}
            mutators={{ ...arrayMutators }}
        >
            {(params) => {
                if (!props.questionnaire.item) {
                    console.error('questionnaire item is missing', props.questionnaire.item);
                    return;
                }
                const items = getEnabledQuestions(props.questionnaire.item, [], params.values);
                return renderForm(items, params);
            }}
        </CustomForm>
    );
};
