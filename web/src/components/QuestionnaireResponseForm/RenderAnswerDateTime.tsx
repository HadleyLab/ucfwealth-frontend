import { DatePicker } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Field, FormRenderProps } from 'react-final-form';

import { QuestionnaireItem } from 'shared/src/contrib/aidbox';

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
    validDate: boolean;
    setValidDate: React.Dispatch<React.SetStateAction<boolean>>;
    answerDateTimeChanged: boolean;
    setAnswerDateTimeChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

export function RenderAnswerDateTime({
    questionItem,
    renderQuestions,
    parentPath,
    formParams,
    index,
    validDate,
    setValidDate,
    answerDateTimeChanged,
    setAnswerDateTimeChanged,
}: Props) {
    const { linkId, text, item } = questionItem;
    const fieldPath = [...parentPath, linkId, _.toString(index)];
    const dateFormat = 'YYYY-MM-DD';

    return (
        <>
            <Field name={[...fieldPath, 'value', 'date'].join('.')}>
                {({ input, meta }) => {
                    if (!input.value) {
                        setValidDate(false);
                    }
                    return (
                        <div className={s.datepicker}>
                            <div className={s.inputField} style={{ marginBottom: 8 }}>
                                {text}
                            </div>
                            <DatePicker
                                defaultValue={input.value && moment(input.value, dateFormat)}
                                onChange={(date, dateString) => {
                                    setAnswerDateTimeChanged(true);
                                    if (!dateString || dateString === '') {
                                        setValidDate(false);
                                    } else {
                                        input.onChange(dateString);
                                        setValidDate(true);
                                    }
                                }}
                                format={dateFormat}
                                status={!validDate && answerDateTimeChanged ? 'error' : ''}
                            />
                            {!validDate && answerDateTimeChanged ? (
                                <div className={s.requiredRed}>Required</div>
                            ) : !validDate && !answerDateTimeChanged ? (
                                <div className={s.requiredGrey}>Required</div>
                            ) : (
                                <div style={{ height: '27px' }} />
                            )}
                        </div>
                    );
                }}
            </Field>
            {item ? renderQuestions(item, [...fieldPath, 'items'], formParams) : null}
        </>
    );
}
