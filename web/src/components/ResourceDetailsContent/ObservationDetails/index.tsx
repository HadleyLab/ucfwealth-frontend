import { Descriptions } from 'antd';
import React from 'react';

import { Observation } from 'shared/src/contrib/aidbox';

import { formatHumanDateTime } from 'src/utils/date';

interface Props {
    observation: Observation;
}

export const ObservationDetails = ({ observation }: Props) => {
    return (
        <Descriptions title={observation.resourceType} column={1} colon={false}>
            <Descriptions.Item label="Id" labelStyle={labelStyle}>
                {observation.id}
            </Descriptions.Item>
            <Descriptions.Item label="Code" labelStyle={labelStyle}>
                {observation.code.coding?.[0].display} {observation.code.coding?.[0].code}
            </Descriptions.Item>
            <Descriptions.Item label="Quantity" labelStyle={labelStyle}>
                {observation.value?.Quantity?.value} {observation.value?.Quantity?.unit}
            </Descriptions.Item>
            <Descriptions.Item label="Datetime" labelStyle={labelStyle}>
                {formatHumanDateTime(observation.effective?.dateTime)}
            </Descriptions.Item>
            <Descriptions.Item label="Status" labelStyle={labelStyle}>
                {observation.status}
            </Descriptions.Item>
        </Descriptions>
    );
};

const labelStyle = { width: 100, fontWeight: 700 };
