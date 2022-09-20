import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select, Space } from 'antd';
import { PickerProps } from 'antd/lib/date-picker/generatePicker';
import TextArea from 'antd/lib/input/TextArea';
import { Option } from 'antd/lib/mentions';
import _ from 'lodash';
import moment, { Moment } from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    calcInitialContext,
    GroupItemProps,
    QuestionItemProps,
    QuestionItems,
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProvider,
    useQuestionnaireResponseFormContext,
} from 'sdc-qrf';

import { isSuccess } from 'aidbox-react/src/libs/remoteData';
import { mapSuccess, service } from 'aidbox-react/src/services/service';

import {
    Coding,
    Questionnaire,
    QuestionnaireItem,
    QuestionnaireItemAnswerOption,
    QuestionnaireResponse,
} from 'shared/src/contrib/aidbox';

import { formatFHIRDate, formatFHIRDateTime } from 'src/utils/date';
import {
    FormItems,
    getDisplay,
    isValueEqual,
    mapFormToResponse,
    mapResponseToForm,
} from 'src/utils/questionnaire';

import s from './QuestionnaireResponseForm.module.scss';

type FormValues = FormItems;

interface Props {
    resource: QuestionnaireResponse;
    questionnaire: Questionnaire;
    customWidgets?: {
        [linkId: string]: (
            questionItem: QuestionnaireItem,
            fieldPath: string[],
            formParams: any,
        ) => React.ReactNode;
    };
    readOnly?: boolean;
    choices: any[];
    currentStep?: number;
    questionnaireId: string;
    progress: number;
    onSave: (resource: QuestionnaireResponse) => Promise<any> | void;
    onChange?: (resource: QuestionnaireResponse) => void;
    setChoices: (value: any[]) => void;
    setCurrentStep?: (value: React.SetStateAction<number>) => void;
}

export const QuestionnaireResponseForm = (props: Props) => {
    const { resource, questionnaire, readOnly, currentStep, setCurrentStep } = props;

    const toFormValues = (): FormValues => {
        return mapResponseToForm(resource, questionnaire);
    };

    const formData = {
        formValues: toFormValues(),
        context: {
            questionnaire: questionnaire,
            questionnaireResponse: resource,
            launchContextParameters: [],
        },
    };

    const onSubmit = (data: QuestionnaireResponseFormData) => {
        console.log(data.formValues);

        // @ts-ignore
        onSave(data.formValues);
        if (setCurrentStep && typeof currentStep === 'number') {
            // TODO add validation
            setCurrentStep(currentStep + 1);
        }
    };

    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState(form.getFieldsValue());

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

    return (
        <Form
            layout="vertical"
            form={form}
            initialValues={formData.formValues}
            onFinish={(values) => onSubmit({ ...formData, formValues: values })}
            onChange={() => setFormValues(form.getFieldsValue())}
        >
            <QuestionnaireResponseFormProvider
                formValues={formValues}
                setFormValues={form.setFieldsValue}
                groupItemComponent={Group}
                questionItemComponents={{
                    text: QuestionText,
                    string: QuestionString,
                    decimal: QuestionDecimal,
                    integer: QuestionInteger,
                    date: QuestionDateTime,
                    dateTime: QuestionDateTime,
                    time: QuestionDateTime,
                    choice: QuestionChoice,
                }}
                readOnly={readOnly}
            >
                <>
                    {formData.context.questionnaire.item ? (
                        <>
                            <QuestionItems
                                questionItems={formData.context.questionnaire.item}
                                parentPath={[]}
                                context={calcInitialContext(formData.context, formValues)}
                            />
                        </>
                    ) : (
                        <div>
                            {console.error('formData.context.questionnaire.item does not exist')}
                        </div>
                    )}
                    {!readOnly && (
                        <Button type="primary" htmlType="submit">
                            Send
                        </Button>
                    )}
                </>
            </QuestionnaireResponseFormProvider>
        </Form>
    );
};

function Group({ parentPath, questionItem, context }: GroupItemProps) {
    const { linkId, text, item, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 'items'];

    if (!item) {
        console.error('item does not exist');
        return <div />;
    }

    if (context[0]) {
        return (
            <Form.Item
                label={<div className={s.groupParagraph}>{text}</div>}
                name={fieldName}
                hidden={hidden}
            >
                <QuestionItems questionItems={item} parentPath={fieldName} context={context[0]} />
            </Form.Item>
        );
    } else {
        console.error('context does not exist');
        return <div />;
    }
}

function QuestionText({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'text'];
    return (
        <Form.Item
            label={<div className={s.groupParagraph}>{text}</div>}
            name={fieldName}
            hidden={hidden}
            style={{}}
        >
            <TextArea rows={4} readOnly={readOnly || qrfContext.readOnly} />
        </Form.Item>
    );
}

function QuestionString({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];

    return (
        <Form.Item
            label={<div className={s.groupParagraph}>{text}</div>}
            name={fieldName}
            hidden={hidden}
            style={{}}
        >
            <Input className={s.inputField} readOnly={readOnly || qrfContext.readOnly} />
        </Form.Item>
    );
}

function QuestionDecimal({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'decimal'];

    return (
        <Form.Item
            label={<div className={s.groupParagraph}>{text}</div>}
            name={fieldName}
            hidden={hidden}
        >
            <InputNumber style={{}} readOnly={readOnly || qrfContext.readOnly} />
        </Form.Item>
    );
}

function QuestionInteger({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'];

    return (
        <Form.Item
            label={<div className={s.groupParagraph}>{text}</div>}
            name={fieldName}
            hidden={hidden}
        >
            <InputNumber
                className={s.inputField}
                style={{ width: '100%' }}
                readOnly={readOnly || qrfContext.readOnly}
            />
        </Form.Item>
    );
}

type DateTimePickerWrapperProps = PickerProps<moment.Moment> & { type: string };

export function DateTimePickerWrapper({ value, onChange, type }: DateTimePickerWrapperProps) {
    const newValue = useMemo(() => (value ? moment(value) : value), [value]);
    const format = type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm';
    const showTime = type === 'date' ? false : true;
    const formatFunction = type === 'date' ? formatFHIRDate : formatFHIRDateTime;

    const change = useCallback(
        (value: Moment | null, dateString: string) => {
            if (value) {
                value.toJSON = () => {
                    return formatFunction(value);
                };
            }
            onChange && onChange(value, dateString);
        },
        [onChange],
    );
    return (
        <DatePicker
            className={s.datepicker}
            showTime={showTime}
            onChange={change}
            format={format}
            value={newValue}
        />
    );
}

function QuestionDateTime({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, type, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', type];
    return (
        <Form.Item
            label={<div className={s.groupParagraph}>{text}</div>}
            name={fieldName}
            hidden={hidden || qrfContext.readOnly}
            style={{ display: 'flex', alignItems: 'self-start' }}
        >
            <DateTimePickerWrapper type={type} />
        </Form.Item>
    );
}

function QuestionChoice({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, answerValueSet, hidden, repeats } = questionItem;
    const [answerOption, setAnserOption] = useState(questionItem.answerOption);

    useEffect(() => {
        (async function () {
            if (answerValueSet) {
                const response = mapSuccess(
                    await service<{ data: Array<{ concept: Coding }> }>({
                        url: '/$query/expand',
                        params: { valueset: answerValueSet, text: '' },
                    }),
                    (data) =>
                        data.data.map((d) => {
                            const result: QuestionnaireItemAnswerOption = {
                                value: { Coding: d.concept },
                            };
                            return result;
                        }),
                );
                if (isSuccess(response)) {
                    setAnserOption(response.data);
                } else {
                    setAnserOption([]);
                }
            }
        })();
    }, [answerValueSet]);

    const options = _.map(answerOption, (opt) => ({
        value: { value: opt.value },
        label: getDisplay(opt.value),
    }));

    if (options.length <= 5) {
        const fieldName = repeats ? [...parentPath, linkId] : [...parentPath, linkId, 0, 'value'];
        return (
            <Form.Item
                label={<div style={{ fontWeight: 700 }}>{text}</div>}
                name={fieldName}
                hidden={hidden}
                className={s.imagingSiteGroup}
            >
                <QuestionRadioChoice options={answerOption} />
            </Form.Item>
        );
    }

    const fieldName = repeats ? [...parentPath, linkId] : [...parentPath, linkId, 0, 'value'];

    if (repeats) {
        return (
            <Form.Item
                label={<div className={s.groupParagraph}>{text}</div>}
                name={fieldName}
                hidden={hidden}
                style={{}}
            >
                <QuestionCheckboxChoice options={answerOption} />
            </Form.Item>
        );
    }

    return (
        <Form.Item
            label={<div className={s.groupParagraph}>{text}</div>}
            name={fieldName}
            hidden={hidden}
        >
            <QuestionSelectChoice options={answerOption} />
        </Form.Item>
    );
}

interface QuestionRadioChoiceProps {
    options?: QuestionnaireItemAnswerOption[];
    value?: any;
    onChange?: any;
}

function QuestionRadioChoice(props: QuestionRadioChoiceProps) {
    const { options, value, onChange } = props;
    const [selected, setSelected] = useState<number>();

    useEffect(() => {
        if (options) {
            options.map((option: any, index: number) => {
                if (isValueEqual(value, option.value)) {
                    setSelected(index);
                }
            });
        }
    }, [options]);

    return (
        <>
            {options ? (
                <Radio.Group
                    onChange={(e) => {
                        onChange(options[e.target.value].value);
                        setSelected(e.target.value);
                    }}
                    value={selected}
                    style={{ padding: 5 }}
                >
                    <Space direction="vertical">
                        {options.map((option: any, index: number) => {
                            return (
                                <Radio key={index} value={index} style={{}}>
                                    {option.value.Coding?.display}
                                </Radio>
                            );
                        })}
                    </Space>
                </Radio.Group>
            ) : (
                <div>options does not exist</div>
            )}
        </>
    );
}

interface QuestionSelectChoiceProps {
    options?: QuestionnaireItemAnswerOption[];
    value?: any;
    onChange?: any;
}

function QuestionSelectChoice(props: QuestionSelectChoiceProps) {
    const { options, value, onChange } = props;

    const getDefaultValue = (value: any) => {
        if (value) {
            if (value.Coding && value.Coding.display) {
                return value.Coding.display;
            }
            if (value.integer) {
                return [value.integer];
            }
        } else return [];
    };

    return (
        <Select
            defaultValue={getDefaultValue(value)}
            onChange={(e) => onChange(options?.[e].value)}
            style={{}}
        >
            {options?.map((option: any, index: number) => {
                const string = String(option.value.Coding?.display || option.value.integer);

                return <Option value={String(index)}>{string}</Option>;
            })}
        </Select>
    );
}

interface QuestionCheckboxChoiceProps {
    options?: QuestionnaireItemAnswerOption[];
    value?: any;
    onChange?: any;
}

function QuestionCheckboxChoice(props: QuestionCheckboxChoiceProps) {
    const { options, value, onChange } = props;

    const defaultValues = value ? value.map((el: any) => el.value.Coding?.display) : [];
    // const defaultValues: CheckboxValueType[] | undefined = [];

    const handleChange = (e: any[]) => {
        if (!options) {
            return;
        }
        const result: any = [];
        for (let i = 0; i < options?.length; i++) {
            e.filter(
                (q) => q === String(options[i].value.Coding?.display) && result.push(options[i]),
            );
        }
        onChange(result);
    };

    return (
        <Checkbox.Group
            className={s.checkBoxGroup}
            defaultValue={defaultValues}
            onChange={handleChange}
        >
            {options?.map((option: any, index: number) => {
                const string = String(option.value.Coding?.display || option.value.integer);

                return (
                    <Checkbox style={{ margin: 0 }} value={string}>
                        {string}
                    </Checkbox>
                );
            })}
        </Checkbox.Group>
    );
}
