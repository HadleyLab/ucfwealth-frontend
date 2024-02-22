import _ from 'lodash';
import { Field, FormRenderProps } from 'react-final-form';

import { QuestionnaireItem } from 'shared/src/contrib/aidbox';

import { InputField } from 'src/components/fields';

import s from './QuestionnaireResponseForm.module.scss';

interface Props {
    formParams: FormRenderProps;
    parentPath: string[];
    questionItem: QuestionnaireItem;
    renderQuestions: (
        items: QuestionnaireItem[],
        parentPath: string[],
        formParams: FormRenderProps,
    ) => JSX.Element[];
    index: number;
}

export function RenderAnswerText({
    questionItem,
    renderQuestions,
    parentPath,
    formParams,
    index,
}: Props) {
    const { linkId, text, item, required, hidden } = questionItem;
    const fieldPath = [...parentPath, linkId, _.toString(index)];
    const name = [...fieldPath, 'value', 'string'].join('.');

    return (
        <div className={s.inputField} style={hidden ? { opacity: '0.3' } : {}}>
            <Field name={name}>
                {({ input, meta }) => {
                    const inputProps = {
                        ...input,
                        ...(hidden ? { disabled: true } : {}),
                    };
                    return (
                        <InputField
                            name={name}
                            input={inputProps}
                            meta={meta}
                            label={text}
                            fieldProps={{
                                validate: required
                                    ? (inputValue: any) =>
                                          _.isUndefined(inputValue) ? 'Required' : undefined
                                    : undefined,
                            }}
                        />
                    );
                }}
            </Field>
            {item ? renderQuestions(item, [...fieldPath, 'items'], formParams) : null}
        </div>
    );
}
