import { Checkbox as ACheckbox, Radio as ARadio, Form, Input as AInput, Select } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import * as _ from 'lodash';
import * as React from 'react';
import { Field } from 'react-final-form';

import './styles.css';

export { SelectField } from './SelectField';

export function getFormItemProps(meta: any): Pick<FormItemProps, 'validateStatus' | 'help'> {
    const hasOwnError = meta.touched && !meta.valid && _.isString(meta.error);
    const hasSubmitError = meta.touched && !meta.valid && !meta.dirtySinceLastSubmit && _.isString(meta.submitError);
    const help = (_.isString(meta.error) && meta.error) || (_.isString(meta.submitError) && meta.submitError);
    const validateStatus = hasOwnError || hasSubmitError ? 'error' : 'validating';

    return { help, validateStatus };
}

interface FieldProps {
    fieldProps?: any;
    formItemProps?: any;
    name: string;
    label?: string | React.ReactNode;
    className?: string;

    [x: string]: any;
}

interface InputFieldProps {
    helpText?: string;
    placeholder?: string;
    append?: string;
    allowClear?: boolean;
}

export function InputField({
    name,
    fieldProps,
    formItemProps,
    label,
    helpText,
    type,
    ...props
}: FieldProps & InputFieldProps) {
    return (
        <Field name={name} {...fieldProps} type={type}>
            {({ input, meta }) => {
                const Component = type === 'textarea' ? AInput.TextArea : AInput;

                return (
                    <Form.Item {...formItemProps} label={label} {...getFormItemProps(meta)} extra={helpText}>
                        <Component {...input} {...props} />
                    </Form.Item>
                );
            }}
        </Field>
    );
}

interface ChooseFieldOption<T> {
    value: T;
    label: string;
    icon?: { type?: string; component?: React.FC };
}

interface ChooseFieldProps<T> {
    helpText?: string;
    multiple?: boolean;
    options: Array<ChooseFieldOption<T>>;
    isEqual?: (first: T, second: T) => boolean;
    renderOptionContent?: (option: ChooseFieldOption<T>, index: number, value: T | T[]) => React.ReactNode;
    radioButton?: boolean;
    onChange?: (v: any) => void;
    className?: string;
}

export function ChooseField<T = any>({
    fieldProps,
    formItemProps,
    label,
    helpText,
    name,
    multiple,
    options,
    renderOptionContent,
    isEqual: comparator,
    radioButton,
    onChange,
    className,
}: FieldProps & ChooseFieldProps<T>) {
    const isEqual = comparator ? comparator : _.isEqual;

    return (
        <Field name={name} {...fieldProps}>
            {({ input, meta }) => {
                if (multiple) {
                    return (
                        <Form.Item
                            {...formItemProps}
                            label={label}
                            {...getFormItemProps(meta)}
                            extra={helpText}
                            className={className}
                        >
                            {_.map(options, (option, index) => {
                                const isSelected = _.findIndex(input.value, (x: T) => isEqual(x, option.value)) !== -1;

                                return (
                                    <React.Fragment key={`${option.value}-${index}`}>
                                        <ACheckbox
                                            checked={isSelected}
                                            onChange={(event: any) => {
                                                let value;
                                                if (event.target.checked) {
                                                    value = [...input.value, option.value];
                                                } else {
                                                    value = _.reject(input.value, (x) => isEqual(x, option.value));
                                                }
                                                input.onChange(value);
                                                if (onChange) {
                                                    onChange(value);
                                                }
                                            }}
                                        >
                                            {option.label}
                                        </ACheckbox>
                                        {renderOptionContent && renderOptionContent(option, index, input.value)}
                                    </React.Fragment>
                                );
                            })}
                        </Form.Item>
                    );
                } else {
                    const RadioElement = radioButton ? ARadio.Button : ARadio;
                    return (
                        <Form.Item {...formItemProps} label={label} {...getFormItemProps(meta)}>
                            {_.map(options, (option, index) => {
                                const isSelected = isEqual(input.value, option.value);
                                return (
                                    <React.Fragment key={`${option.value}-${index}`}>
                                        <RadioElement
                                            checked={isSelected}
                                            onChange={(event) => {
                                                const value = event.target.checked ? option.value : undefined;
                                                input.onChange(value);
                                                if (onChange) {
                                                    onChange(value);
                                                }
                                            }}
                                        >
                                            {option.label}
                                        </RadioElement>
                                        {renderOptionContent && renderOptionContent(option, index, input.value)}
                                    </React.Fragment>
                                );
                            })}
                        </Form.Item>
                    );
                }
            }}
        </Field>
    );
}

export interface SimpleSelectFieldOption {
    label: string;
    value: string | number;
}

export function SimpleSelectField({
    fieldProps,
    formItemProps,
    name,
    label,
    helpText,
    options,
    ...props
}: FieldProps & { allowClear?: boolean; options: SimpleSelectFieldOption[] }) {
    return (
        <Field name={name} {...fieldProps}>
            {({ input, meta }) => {
                return (
                    <Form.Item {...formItemProps} extra={helpText} label={label} {...getFormItemProps(meta)}>
                        {/* <Select {...input} {...props} showSearch={true} value={input.value ? input.value : undefined}> */}
                        <Select {...input} {...props} value={input.value ? input.value : undefined}>
                            {_.map(options, (item, index) => (
                                <Select.Option key={index} value={item.value}>
                                    {item.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                );
            }}
        </Field>
    );
}

export function CheckBoxField({ fieldProps, formItemProps, name, label, helpText, ...props }: FieldProps) {
    return (
        <Field name={name} type="checkbox" {...fieldProps}>
            {({ input, meta }) => {
                return (
                    <Form.Item {...formItemProps} extra={helpText} {...getFormItemProps(meta)}>
                        <ACheckbox {...input} {...props}>
                            {label}
                        </ACheckbox>
                    </Form.Item>
                );
            }}
        </Field>
    );
}
