import { Descriptions } from 'antd';
import React from 'react';

import { Condition } from 'shared/src/contrib/aidbox';

interface Props {
    condition: Condition;
}

export const ConditionDetails = ({ condition }: Props) => {
    return (
        <Descriptions title={condition.resourceType} column={1} colon={false}>
            <Descriptions.Item label="Id" labelStyle={labelStyle}>
                {condition.id}
            </Descriptions.Item>
            <Descriptions.Item label="Category" labelStyle={labelStyle}>
                {condition.category?.[0].coding?.[0].display}
            </Descriptions.Item>
            <Descriptions.Item label="Code" labelStyle={labelStyle}>
                {condition.code?.coding?.[0].display}
            </Descriptions.Item>
            <Descriptions.Item label="Verification Status" labelStyle={labelStyle}>
                {condition.verificationStatus?.coding?.[0].code}
            </Descriptions.Item>
        </Descriptions>
    );
};

const labelStyle = { width: 100, fontWeight: 700 };
