import { Form } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { Field } from 'react-final-form';
import Select from 'react-select';

import '../styles.css';
import { getFormItemProps } from 'src/components/fields';

interface Props<T> {
    name: string;
    label?: string;
    placeholder?: string;
    helpText?: string;
    fieldProps?: any;
    formItemProps?: any;
    options: T[];
    readOnly?: boolean;
    onChange?: (v: any) => void;
    getOptionLabel: (option: T) => string;
    getOptionValue: (option: T) => string;
    isMulti?: boolean;
}

export class SelectField<T> extends React.Component<Props<T>, {}> {
    public render() {
        const {
            readOnly,
            name,
            label,
            placeholder = 'Select...',
            helpText,
            fieldProps,
            formItemProps,
            options,
            getOptionLabel,
            getOptionValue,
            onChange,
            isMulti,
        } = this.props;

        return (
            <Field name={name} {...fieldProps}>
                {({ input, meta }) => {
                    const genericFormItemProps = getFormItemProps(meta);

                    return (
                        <Form.Item
                            {...formItemProps}
                            label={label}
                            {...genericFormItemProps}
                            extra={helpText}
                        >
                            <Select
                                isDisabled={readOnly}
                                options={options}
                                classNamePrefix="react-select"
                                className={classNames('react-select', {
                                    'is-invalid': genericFormItemProps.validateStatus === 'error',
                                })}
                                placeholder={placeholder}
                                getOptionLabel={getOptionLabel}
                                getOptionValue={getOptionValue}
                                {...input}
                                onChange={(v: any) => {
                                    if (onChange) {
                                        onChange(v);
                                    }
                                    input.onChange(v);
                                }}
                                isMulti={isMulti}
                            />
                        </Form.Item>
                    );
                }}
            </Field>
        );
    }
}
