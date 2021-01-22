import _ from 'lodash';
import * as React from 'react';
import { Field, FieldProps } from 'react-final-form';

interface ChooseFieldOption {
    value: any;
    label: string;
}

interface ChoiceFieldProps {
    options: Array<ChooseFieldOption>;
}

export function ChoiceField<T = any>({ fieldProps, label, name, options }: FieldProps<T, any> & ChoiceFieldProps) {
    return (
        <Field name={name} {...fieldProps}>
            {({ input }) => {
                return (
                    <div
                    >
                        <label>{label}:</label>
                        <select onChange={input.onChange} defaultValue={input.value}>
                            {_.map(options, (option) => {
                                return (
                                    <option key={option.value.Coding.code} value={option.value}>
                                        {option.label}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                );
            }}
        </Field>
    );
}
