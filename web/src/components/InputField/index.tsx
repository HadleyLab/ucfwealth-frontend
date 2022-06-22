import { FieldInputProps, FieldMetaState } from 'react-final-form';

interface InputFieldProps {
    input: FieldInputProps<string>;
    meta: FieldMetaState<string>;
    label?: string;
    placeholder?: string;
}

export function InputField({ input, meta, label, placeholder }: InputFieldProps) {
    return (
        <div>
            <label>{label}</label>
            <input type="text" {...input} placeholder={placeholder} />
            {meta.touched && meta.error && <span>{meta.error}</span>}
        </div>
    );
}
