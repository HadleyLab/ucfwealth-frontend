import { Checkbox as ACheckbox, Radio as ARadio, Form, Select } from 'antd';
import _ from 'lodash';
import React from 'react';
import { Field } from 'react-final-form';

import { FieldProps, getFormItemProps } from 'src/components/fields';

interface ChooseFieldOption<T> {
    value: T;
    label: string;
    icon?: { type?: string; component?: React.FC };
}

import s from './ChooseField.module.scss';

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
    const { Option } = Select;

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
                        <Form.Item
                            {...formItemProps}
                            label={label}
                            {...getFormItemProps(meta)}
                            className={s.formitem}
                        >
                            {options.length > 10 ? (
                                <Select
                                    showSearch
                                    placeholder="Select"
                                    optionFilterProp="children"
                                    defaultValue={input.value.value?.Coding.display}
                                    onChange={(event) => {
                                        const eventParsed = JSON.parse(event);
                                        const value = eventParsed.value
                                            ? eventParsed.value
                                            : undefined;
                                        input.onChange(value);
                                        if (onChange) {
                                            onChange(value);
                                        }
                                    }}
                                    filterOption={(input, option) =>
                                        (option!.children as unknown as string)
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {options.map((option) => {
                                        return (
                                            <Option value={JSON.stringify(option)}>
                                                {option.label}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            ) : (
                                _.map(options, (option, index) => {
                                    const isSelected = isEqual(input.value, option.value);
                                    return (
                                        <div key={`${option.value}-${index}`}>
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
                                                className={s.radio}
                                            >
                                                {option.label}
                                            </RadioElement>
                                            {renderOptionContent &&
                                                renderOptionContent(option, index, input.value)}
                                        </div>
                                    );
                                })
                            )}
                        </Form.Item>
                    );
                }
            }}
        </Field>
    );
}
