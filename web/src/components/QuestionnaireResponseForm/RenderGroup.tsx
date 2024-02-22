import { Button } from 'antd';
import _ from 'lodash';
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
}

export function RenderGroup({ questionItem, renderQuestions, parentPath, formParams }: Props) {
    const { linkId, item, text, repeats } = questionItem;
    if (!item) return null;

    if (repeats) {
        const baseFieldPath = [...parentPath, linkId];

        return (
            <Field name={baseFieldPath.join('.')}>
                {({ input }) => {
                    return (
                        <div>
                            <div>
                                {_.map(
                                    input.value.items && input.value.items.length
                                        ? input.value.items
                                        : [{}],
                                    (_elem, index: number) => {
                                        if (index > 0 && !input.value.items[index]) {
                                            return null;
                                        }
                                        return (
                                            <div
                                                className={s.imagingSiteGroup}
                                                key={`group-${index}`}
                                            >
                                                <div className={s.imagingSiteHeader}>
                                                    <div className={s.groupParagraphHeader}>{`${
                                                        questionItem.text
                                                    } #${index + 1}`}</div>
                                                    <Button
                                                        onClick={() => {
                                                            const filteredArray = _.filter(
                                                                input.value.items,
                                                                (_val, valIndex: number) =>
                                                                    valIndex !== index,
                                                            );
                                                            input.onChange({
                                                                items: [...filteredArray],
                                                            });
                                                        }}
                                                    >
                                                        <span>Remove</span>
                                                    </Button>
                                                </div>
                                                <div>
                                                    {renderQuestions(
                                                        item,
                                                        [
                                                            ...parentPath,
                                                            linkId,
                                                            'items',
                                                            index.toString(),
                                                        ],
                                                        formParams,
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                            <div className={s.addAnother}>
                                <Button
                                    onClick={() => {
                                        const existingItems = input.value.items || [];
                                        const updatedInput = {
                                            items: [...existingItems, {}],
                                        };
                                        input.onChange(updatedInput);
                                    }}
                                >
                                    <p>{`+ Add another ${text}`}</p>
                                </Button>
                            </div>
                        </div>
                    );
                }}
            </Field>
        );
    }

    const paragraphs = _.split(text, '\n');

    return (
        <div className={s.groupContainer}>
            {parentPath.length === 0 ? (
                <h2 className={s.groupTitle}>{text}</h2>
            ) : (
                _.map(paragraphs, (paragraph, index) => {
                    return (
                        <p key={`group-paragraph-${index}`} className={s.groupParagraph}>
                            {paragraph}
                        </p>
                    );
                })
            )}
            {renderQuestions(item, [...parentPath, linkId, 'items'], formParams)}
        </div>
    );
}
