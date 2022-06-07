/* eslint-disable dot-notation */
import { Descriptions } from 'antd';
import React from 'react';

import { ImagingStudy } from 'shared/src/contrib/aidbox';

import { formatHumanDateTime } from 'src/utils/date';

interface Props {
    imagingStudy: ImagingStudy;
}

export const ImagingStudyDetails = ({ imagingStudy }: Props) => {
    return (
        <Descriptions title={imagingStudy.resourceType} column={1} colon={false}>
            <Descriptions.Item label="Id" labelStyle={labelStyle}>
                {imagingStudy.id}
            </Descriptions.Item>
            <Descriptions.Item label="Series" labelStyle={labelStyle}>
                {imagingStudy.series?.[0].bodySite?.display}
            </Descriptions.Item>
            <Descriptions.Item label="Modality" labelStyle={labelStyle}>
                {imagingStudy.series?.[0].modality.code} {imagingStudy.series?.[0].modality.display}
            </Descriptions.Item>
            <Descriptions.Item label="Location" labelStyle={labelStyle}>
                {imagingStudy.location?.display}
            </Descriptions.Item>
            <Descriptions.Item label="Created At" labelStyle={labelStyle}>
                {formatHumanDateTime(imagingStudy?.meta?.['createdAt'])}
            </Descriptions.Item>
        </Descriptions>
    );
};

const labelStyle = { width: 100, fontWeight: 700 };
