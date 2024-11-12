import { StepProps, Steps } from 'antd';
import { QuestionnaireItem } from 'fhir/r4b';
import { useState } from 'react';
import { GroupItemProps, QuestionItems } from 'sdc-qrf';

import { Title } from '@beda.software/emr/components';

import { S } from './styles';

export function Wizzard(props: GroupItemProps) {
    const { parentPath, questionItem, context } = props;
    const [current, setCurrent] = useState(0);
    const { item = [], linkId, text } = questionItem;
    const stepsItems: StepProps[] = item.map((i: QuestionnaireItem) => ({}));
    const currentItem = item[current];

    const onStepChange = (value: number) => {
        setCurrent(value);
    };

    return (
        <S.Container>
            <Title level={3}>{text}</Title>
            <Steps items={stepsItems} current={current} style={{ marginBottom: 40 }} onChange={onStepChange} />
            <S.Content>
                {currentItem ? (
                    <>
                        <Title level={4}>{currentItem.text}</Title>
                        <QuestionItems
                            questionItems={currentItem.item!}
                            parentPath={[...parentPath, linkId, 'items', currentItem.linkId, 'items']}
                            context={context[0]!}
                        />
                    </>
                ) : null}
            </S.Content>
        </S.Container>
    );
}
