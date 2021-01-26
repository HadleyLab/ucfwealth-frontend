import { Checkbox as ACheckbox, Radio as ARadio, Form } from 'antd';
import * as _ from 'lodash';
import * as React from 'react';
import { Field } from 'react-final-form';

import { FieldProps, getFormItemProps } from 'src/components/fields';

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
    renderOptionContent?: (
        option: ChooseFieldOption<T>,
        index: number,
        value: T | T[],
    ) => React.ReactNode;
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
                                const isSelected =
                                    _.findIndex(input.value, (x: T) => isEqual(x, option.value)) !==
                                    -1;

                                return (
                                    <React.Fragment key={`${option.value}-${index}`}>
                                        <ACheckbox.Group>
                                            <ACheckbox
                                                checked={isSelected}
                                                onChange={(event: any) => {
                                                    let value;
                                                    if (event.target.checked) {
                                                        value = [...input.value, option.value];
                                                    } else {
                                                        value = _.reject(input.value, (x) =>
                                                            isEqual(x, option.value),
                                                        );
                                                    }
                                                    input.onChange(value);
                                                    if (onChange) {
                                                        onChange(value);
                                                    }
                                                }}
                                            >
                                                {option.label}
                                            </ACheckbox>
                                        </ACheckbox.Group>
                                        {renderOptionContent &&
                                            renderOptionContent(option, index, input.value)}
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
                                                const value = event.target.checked
                                                    ? option.value
                                                    : undefined;
                                                input.onChange(value);
                                                if (onChange) {
                                                    onChange(value);
                                                }
                                            }}
                                        >
                                            {option.label}
                                        </RadioElement>
                                        {renderOptionContent &&
                                            renderOptionContent(option, index, input.value)}
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
