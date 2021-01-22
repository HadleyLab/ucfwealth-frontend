import { Form, Input as AInput, DatePicker, Tooltip } from 'antd';
import { DatePickerProps } from 'antd/lib/date-picker';
import * as _ from 'lodash';
import moment from 'moment';
import * as React from 'react';
import { Field } from 'react-final-form';

import { getFormItemProps, FieldProps } from 'src/components/fields';
import {
    formatFHIRDate,
    formatFHIRDateTime,
    formatHumanDate,
    formatHumanDateTime,
    humanDate,
    humanDateTime,
    parseFHIRDate,
    parseFHIRDateTime,
} from 'src/utils/date';

import './styles.css';

export function DateTimePickerField({
    fieldProps,
    formItemProps,
    name,
    label,
    helpText,
    showTime,
    ...props
}: DatePickerProps & FieldProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [textInputValue, setTextInputValue] = React.useState<string | undefined>(undefined);

    return (
        <Field name={name} {...fieldProps}>
            {({ input, meta }) => {
                const getRawFieldValue = () => {
                    if (!input.value) {
                        return undefined;
                    }
                    if (showTime) {
                        return parseFHIRDateTime(input.value);
                    } else {
                        return parseFHIRDate(input.value);
                    }
                };

                const getDisplayFieldValue = () => {
                    if (!input.value) {
                        return undefined;
                    }

                    if (showTime) {
                        return formatHumanDateTime(input.value);
                    } else {
                        return formatHumanDate(input.value);
                    }
                };
                const onFieldChange = (newValue: moment.Moment | null) => {
                    if (newValue && newValue.isValid()) {
                        input.onChange(
                            showTime ? formatFHIRDateTime(newValue) : formatFHIRDate(newValue),
                        );
                    } else {
                        input.onChange(undefined);
                    }
                };

                return (
                    <Form.Item
                        {...formItemProps}
                        label={label}
                        extra={helpText}
                        {...getFormItemProps(meta)}
                    >
                        {isOpen ? (
                            <DatePicker
                                placeholder=""
                                suffixIcon={<span />}
                                // showTime={showTime}
                                open={isOpen}
                                onOpenChange={(status) => setIsOpen(status)}
                                {...input}
                                {...props}
                                format={showTime ? humanDateTime : humanDate}
                                value={getRawFieldValue()}
                                onChange={(date) => {
                                    onFieldChange(date);
                                    setIsOpen(false);
                                }}
                            />
                        ) : (
                            <AInput
                                className={props.className}
                                allowClear={props.allowClear}
                                placeholder={props.placeholder || 'Input date'}
                                name={input.name}
                                value={
                                    !_.isUndefined(textInputValue)
                                        ? textInputValue
                                        : getDisplayFieldValue()
                                }
                                onChange={(event) => setTextInputValue(event.target.value)}
                                onBlur={(event) => {
                                    onFieldChange(moment(event.target.value, 'MM.DD.YYYY'));

                                    setTextInputValue(undefined);
                                    input.onBlur(event);
                                }}
                                onFocus={input.onFocus}
                                suffix={
                                    <Tooltip title="Select date">
                                        <span onClick={() => setIsOpen(true)}>&#128467;</span>
                                    </Tooltip>
                                }
                            />
                        )}
                    </Form.Item>
                );
            }}
        </Field>
    );
}
