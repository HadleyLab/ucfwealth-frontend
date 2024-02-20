import _ from 'lodash';
import { FormRenderProps } from 'react-final-form';

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

export function RenderAnswerNumeric({
    questionItem,
    renderQuestions,
    parentPath,
    formParams,
    index,
}: Props) {
    const { linkId, text, type, item, required, hidden } = questionItem;
    const fieldPath = [...parentPath, linkId, _.toString(index)];

    const inputFieldPath = [...fieldPath, 'value', type];

    return (
        <div className={s.inputField}>
            <InputField
                name={inputFieldPath.join('.')}
                fieldProps={{
                    parse: (value: any) =>
                        value
                            ? type === 'integer'
                                ? _.parseInt(value)
                                : parseFloat(value)
                            : undefined,
                    validate: required
                        ? (inputValue: any) => (_.isUndefined(inputValue) ? 'Required' : undefined)
                        : undefined,
                }}
                type="number"
                label={text}
                disabled={hidden}
                // helpText={helpText}
                // addonAfter={unit && unit.display!}
            />
            {item ? renderQuestions(item, [...fieldPath, 'items'], formParams) : null}
        </div>
    );
}
