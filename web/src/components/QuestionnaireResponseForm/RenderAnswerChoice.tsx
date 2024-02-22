import _ from 'lodash';
import { useEffect, useState } from 'react';
import { FormRenderProps } from 'react-final-form';

import { isSuccess } from 'aidbox-react/src/libs/remoteData';
import { mapSuccess, service } from 'aidbox-react/src/services/service';

import {
    Coding,
    QuestionnaireItem,
    QuestionnaireItemAnswerOption,
} from 'shared/src/contrib/aidbox';

import { FormAnswerItems, getDisplay, isValueEqual } from 'src/utils/questionnaire';

import { ChooseField } from '../fields/ChooseField';
import s from './QuestionnaireResponseForm.module.scss';

interface Props {
    questionItem: QuestionnaireItem;
    parentPath: string[];
    formParams: FormRenderProps;
    addChoiceValueToProgressBar: (choice: any) => void;
    renderQuestions: (
        items: QuestionnaireItem[],
        parentPath: string[],
        formParams: FormRenderProps,
    ) => JSX.Element[];
}

export function RenderAnswerChoice({
    questionItem,
    parentPath,
    formParams,
    addChoiceValueToProgressBar,
    renderQuestions,
}: Props) {
    const { linkId, text, item, repeats, required, answerValueSet } = questionItem;
    const fieldPath = [...parentPath, linkId, ...(repeats ? [] : ['0'])];
    const fieldName = fieldPath.join('.');
    const [answerOption, setAnswerOption] = useState(questionItem.answerOption);
    useEffect(() => {
        (async function () {
            if (answerValueSet) {
                console.log(answerValueSet);

                const response = mapSuccess(
                    await service<{ data: Array<{ concept: Coding }> }>({
                        url: '/$query/expand',
                        params: { valueset: answerValueSet, text: '' },
                    }),
                    (data) =>
                        data.data.map((d) => {
                            const result: QuestionnaireItemAnswerOption = {
                                value: { Coding: d.concept },
                            };
                            return result;
                        }),
                );
                if (isSuccess(response)) {
                    setAnswerOption(response.data);
                } else {
                    setAnswerOption([]);
                }
            }
        })();
    }, [answerValueSet]);

    return (
        <ChooseField<FormAnswerItems>
            name={fieldName}
            label={<div className={s.chooseFieldLabel}>{text}</div>}
            multiple={repeats}
            inline={!item && !repeats}
            options={_.map(answerOption, (opt) => ({
                value: { value: opt.value },
                label: getDisplay(opt.value),
            }))}
            fieldProps={{
                validate: required
                    ? (inputValue: any) => {
                          if (repeats) {
                              if (!inputValue?.length) {
                                  return 'Choose at least one option';
                              }
                          } else {
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
                if (item && selectedIndex !== -1) {
                    const subItemParentPath = [
                        ...fieldPath,
                        ...(repeats ? [_.toString(selectedIndex)] : []),
                        'items',
                    ];
                    return renderQuestions(item, subItemParentPath, formParams);
                }
                return null;
            }}
        />
    );
}
