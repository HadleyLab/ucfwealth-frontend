import * as React from 'react';
import { FieldInputProps, FieldMetaState } from 'react-final-form';

import { dateTime } from 'shared/src/contrib/aidbox';

interface InputFieldProps {
    input: FieldInputProps<dateTime>;
    meta: FieldMetaState<string>;
    label?: string;
    placeholder?: string;
}

export function DateTimePickerField({ input, meta, label, placeholder }: InputFieldProps) {
    return (
        <div>
            <label>{label}</label>
            <input type="date" {...input} placeholder={placeholder} />
            {meta.touched && meta.error && <span>{meta.error}</span>}
        </div>
    );
}
