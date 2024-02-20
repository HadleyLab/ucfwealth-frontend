import _ from 'lodash';

import { QuestionnaireItem } from 'shared/src/contrib/aidbox';

import { FormAnswerItems, isValueEqual } from 'src/utils/questionnaire';

import { ChooseField } from '../fields/ChooseField';
import s from './QuestionnaireResponseForm.module.scss';

interface Props {
    questionItem: QuestionnaireItem;
    parentPath: string[];
    addChoiceValueToProgressBar: (choice: any) => void;
}

export function RenderAnswerBoolean({
    questionItem,
    parentPath,
    addChoiceValueToProgressBar,
}: Props) {
    const { linkId, text, item, required } = questionItem;
    const fieldPath = [...parentPath, linkId, '0'];
    const fieldName = fieldPath.join('.');
    const answerOption = [
        {
            value: { value: false },
            display: 'No',
        },
        {
            value: { value: true },
            display: 'Yes',
        },
    ];
    return (
        <ChooseField<FormAnswerItems>
            name={fieldName}
            label={<div className={s.chooseFieldLabel}>{text}</div>}
            inline={!item}
            options={_.map(answerOption, (opt) => ({
                value: { value: opt.value },
                label: opt.display,
            }))}
            fieldProps={{
                validate: required
                    ? (inputValue: any) => {
                          {
                              if (!inputValue) {
                                  return 'Required';
                              }
                          }
                          return undefined;
                      }
                    : undefined,
            }}
            isEqual={(value1: any, value2: any) => isValueEqual(value1.value, value2.value)}
            renderOptionContent={(option, index, value) => {
                const selectedIndex = _.findIndex(_.isArray(value) ? value : [value], (answer) =>
                    isValueEqual(answer.value, option.value.value),
                );
                selectedIndex === 0
                    ? addChoiceValueToProgressBar({ question: questionItem.text, ...value })
                    : null;
                return null;
            }}
        />
    );
}
