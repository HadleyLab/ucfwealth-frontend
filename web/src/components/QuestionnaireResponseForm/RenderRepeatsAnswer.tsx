import { Button } from 'antd';
import _ from 'lodash';
import React from 'react';
import { Field, FormRenderProps } from 'react-final-form';

import { QuestionnaireItem } from 'shared/src/contrib/aidbox';

interface Props {
    formParams: FormRenderProps;
    parentPath: string[];
    questionItem: QuestionnaireItem;
    renderAnswer: (
        questionItem: QuestionnaireItem,
        parentPath: string[],
        formParams: FormRenderProps,
        index: number,
    ) => React.ReactNode;
}

export function RenderRepeatsAnswer({ questionItem, renderAnswer, parentPath, formParams }: Props) {
    const { linkId, text, required } = questionItem;
    const baseFieldPath = [...parentPath, linkId];

    if (!required) {
        console.error('TODO: Unsupported question which is not required and repeats');
    }

    return (
        <Field name={baseFieldPath.join('.')}>
            {({ input }) => {
                return (
                    <div>
                        <div>{text}</div>

                        {_.map(input.value.length ? input.value : [{}], (elem, index: number) => {
                            if (index > 0 && !input.value[index]) {
                                return null;
                            }

                            return (
                                <div key={`repeatsAnswer-${index}`} className="d-flex">
                                    <div className="flex-grow-1">
                                        {renderAnswer(questionItem, parentPath, formParams, index)}
                                    </div>
                                    {index > 0 ? (
                                        <div
                                            style={{
                                                width: 40,
                                                height: 40,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            onClick={() =>
                                                input.onChange(
                                                    _.filter(
                                                        input.value,
                                                        (val, valIndex: number) =>
                                                            valIndex !== index,
                                                    ),
                                                )
                                            }
                                        >
                                            Delete{' '}
                                        </div>
                                    ) : (
                                        <div style={{ width: 40 }} />
                                    )}
                                </div>
                            );
                        })}
                        <Button
                            onClick={() =>
                                input.onChange(input.value.length ? [...input.value, {}] : [{}, {}])
                            }
                        >
                            Add another answer
                        </Button>
                    </div>
                );
            }}
        </Field>
    );
}
