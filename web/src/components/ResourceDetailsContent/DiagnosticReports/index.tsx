import { Descriptions } from 'antd';
import React from 'react';

import { DiagnosticReport } from 'shared/src/contrib/aidbox';

import { formatHumanDateTime } from 'src/utils/date';

interface Props {
    diagnosticReport: DiagnosticReport;
}

export const DiagnosticReports = ({ diagnosticReport }: Props) => {
    return (
        <Descriptions title={diagnosticReport.resourceType} column={1} colon={false}>
            <Descriptions.Item label="Id" labelStyle={labelStyle}>
                {diagnosticReport.id}
            </Descriptions.Item>
            <Descriptions.Item label="Code" labelStyle={labelStyle}>
                {diagnosticReport.code.coding?.[0].display} {diagnosticReport.code.coding?.[0].code}
            </Descriptions.Item>
            <Descriptions.Item label="Datetime" labelStyle={labelStyle}>
                {formatHumanDateTime(diagnosticReport.effective?.dateTime)}
            </Descriptions.Item>
        </Descriptions>
    );
};

const labelStyle = { width: 100, fontWeight: 700 };
