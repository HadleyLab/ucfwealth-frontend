import { FormApi, Unsubscribe } from 'final-form';
import arrayMutators from 'final-form-arrays';
import _ from 'lodash';
import * as React from 'react';
import { Field, FormRenderProps } from 'react-final-form';

import { Questionnaire, QuestionnaireItem, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { Button } from 'src/components/Button';
import { DateTimePickerField } from 'src/components/DateTimePickerField';
import { InputField } from 'src/components/fields';
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

interface Props {
    resource: QuestionnaireResponse;
    questionnaire: Questionnaire;
    onSave: (resource: QuestionnaireResponse) => Promise<any> | void;
    onChange?: (resource: QuestionnaireResponse) => void;
    customWidgets?: {
        [linkId: string]: (
            questionItem: QuestionnaireItem,
            fieldPath: string[],
            formParams: FormRenderProps,
        ) => React.ReactNode;
    };
    readOnly?: boolean;
}

type FormValues = FormItems;

export class QuestionnaireResponseForm extends React.Component<Props> {
    public onSave = async (values: FormValues) => {
        const { onSave } = this.props;
        const updatedResource = this.fromFormValues(values);

        return onSave(updatedResource);
    };

    public fromFormValues(values: FormValues) {
        const { questionnaire, resource } = this.props;

        return {
            ...resource,
            ...mapFormToResponse(values, questionnaire),
        };
    }

    public toFormValues(): FormValues {
        const { resource, questionnaire } = this.props;
        return mapResponseToForm(resource, questionnaire);
    }

    public renderRepeatsAnswer(
        renderAnswer: (
            questionItem: QuestionnaireItem,
            parentPath: string[],
            formParams: FormRenderProps,
            index: number,
        ) => React.ReactNode,
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
    ) {
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
                                                    style={{ width: 40, height: 40 }}
                                                    className="d-flex align-items-center justify-content-center"
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
    }

    public renderAnswerText(
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
        index = 0,
    ) {
        const { linkId, text, item, hidden } = questionItem;
        const fieldPath = [...parentPath, linkId, _.toString(index)];
        const name = [...fieldPath, 'value', 'string'].join('.');

        return (
            <div style={hidden ? { opacity: '0.3' } : {}}>
                <Field name={name}>
                    {({ input, meta }) => {
                        const inputProps = {
                            ...input,
                            ...(hidden ? { disabled: true } : {}),
                        };
                        return (
                            <InputField name={name} input={inputProps} meta={meta} label={text} />
                        );
                    }}
                </Field>
                {item ? this.renderQuestions(item, [...fieldPath, 'items'], formParams) : null}
            </div>
        );
    }

    public renderAnswerNumeric = (
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
        index = 0,
    ) => {
        const { linkId, text, type, item, required, hidden } = questionItem;
        const fieldPath = [...parentPath, linkId, _.toString(index)];

        const inputFieldPath = [...fieldPath, 'value', type];

        return (
            <>
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
                {item ? this.renderQuestions(item, [...fieldPath, 'items'], formParams) : null}
            </>
        );
    };

    public renderAnswerDateTime(
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
        index = 0,
    ) {
        const { linkId, text, item } = questionItem;
        const fieldPath = [...parentPath, linkId, _.toString(index)];

        return (
            <>
                <Field name={[...fieldPath, 'value', 'date'].join('.')}>
                    {({ input, meta }) => {
                        return <DateTimePickerField input={input} meta={meta} label={text} />;
                    }}
                </Field>

                {item ? this.renderQuestions(item, [...fieldPath, 'items'], formParams) : null}
            </>
        );
    }

    public renderAnswerChoice = (
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
                label={text}
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

                    if (item && selectedIndex !== -1) {
                        const subItemParentPath = [
                            ...fieldPath,
                            ...(repeats ? [_.toString(selectedIndex)] : []),
                            'items',
                        ];

                        return this.renderQuestions(item, subItemParentPath, formParams);
                    }

                    return null;
                }}
            />
        );
    };

    public renderGroup(
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
        // fieldsRenderConfig: FieldsRenderConfig,
    ) {
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
                                                            {this.renderQuestions(
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

            return (
                <div style={{ paddingBottom: 10 }}>
                    <p>{text}</p>
                    {this.renderQuestions(item, [...parentPath, linkId, 'items'], formParams)}
                </div>
            );
        }
        return null;
    }

    public renderAnswer(
        rawQuestionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
    ): any {
        const questionItem = {
            ...rawQuestionItem,
            text: interpolateAnswers(rawQuestionItem.text!, parentPath, formParams.values),
        };
        // const { linkId, type, item, text } = questionItem;
        const { type } = questionItem;

        if (type === 'string' || type === 'text') {
            return this.renderRepeatsAnswer(
                this.renderAnswerText,
                questionItem,
                parentPath,
                formParams,
            );
        }

        if (type === 'integer' || type === 'decimal') {
            return this.renderRepeatsAnswer(
                this.renderAnswerNumeric,
                questionItem,
                parentPath,
                formParams,
            );
        }

        if (type === 'date' || type === 'dateTime') {
            return this.renderRepeatsAnswer(
                this.renderAnswerDateTime,
                questionItem,
                parentPath,
                formParams,
            );
        }

        if (type === 'choice') {
            return this.renderAnswerChoice(questionItem, parentPath, formParams);
        }

        if (type === 'display') {
            return <div>{questionItem.text}</div>;
        }

        if (type === 'group') {
            return this.renderGroup(questionItem, parentPath, formParams);
        }

        console.error(`TODO: Unsupported item type ${type}`);

        return null;
    }

    public renderQuestions(
        items: QuestionnaireItem[],
        parentPath: string[],
        formParams: FormRenderProps,
    ) {
        // return _.map(getEnabledQuestions(items, parentPath, formParams.values), (item, index) => (
        //     <div key={index}>{this.renderAnswer(item, parentPath, formParams)}</div>
        // ));
        return _.map(items, (item, index) => (
            <div key={index}>{this.renderAnswer(item, parentPath, formParams)}</div>
        ));
    }

    public renderForm = (items: QuestionnaireItem[], formParams: FormRenderProps) => {
        const { readOnly } = this.props;
        const { handleSubmit, submitting } = formParams;

        return (
            <>
                {this.renderQuestions(items, [], formParams)}
                {!readOnly && (
                    <div className="questionnaire-form-actions">
                        <Button onClick={handleSubmit} disabled={submitting}>
                            Save
                        </Button>
                    </div>
                )}
            </>
        );
    };

    protected onFormChange = (form: FormApi<FormValues>): Unsubscribe => {
        const unsubscribe = form.subscribe(
            ({ values }) => {
                const { onChange } = this.props;
                if (onChange) {
                    if (!_.isEqual(values, this.toFormValues())) {
                        const updatedResource = this.fromFormValues(values);
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

    public render() {
        const { questionnaire } = this.props;

        return (
            <CustomForm<FormValues>
                onSubmit={this.onSave}
                layout={'vertical'}
                initialValues={this.toFormValues()}
                initialValuesEqual={_.isEqual}
                decorators={[this.onFormChange]}
                mutators={{ ...arrayMutators }}
            >
                {(params) => {
                    const items = getEnabledQuestions(questionnaire.item!, [], params.values);

                    // return this.renderForm(items, { ...params, values: params.values });
                    return this.renderForm(items, params);
                }}
            </CustomForm>
        );
    }
}