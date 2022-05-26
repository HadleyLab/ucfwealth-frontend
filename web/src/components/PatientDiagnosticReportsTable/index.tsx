import { Table } from 'antd';
import React from 'react';

import { DiagnosticReport } from 'shared/src/contrib/aidbox';

import { formatHumanDateTime } from 'src/utils/date';

interface Props {
    diagnosticReportList: DiagnosticReport[];
}

export const PatientDiagnosticReportsTable = ({ diagnosticReportList }: Props) => {
    const dataSource = diagnosticReportList.map((diagnosticReport) => {
        return {
            key: diagnosticReport.id,
            id: <div>{diagnosticReport.id}</div>,
            code: (
                <div>
                    <div>{diagnosticReport.code.coding?.[0].display}</div>
                    <div>{diagnosticReport.code.coding?.[0].code}</div>
                </div>
            ),
            datetime: <div>{formatHumanDateTime(diagnosticReport.effective?.dateTime)}</div>,
        };
    });

    const columns = [
        {
            title: <b>Id</b>,
            dataIndex: 'id',
            key: 'id',
            width: '30%',
            align: 'center' as 'center',
        },
        {
            title: <b>Code</b>,
            dataIndex: 'code',
            key: 'code',
            width: '60%',
            align: 'center' as 'center',
        },
        {
            title: <b>Datetime</b>,
            dataIndex: 'datetime',
            key: 'datetime',
            width: '10%',
            align: 'center' as 'center',
        },
    ];

    return <Table dataSource={dataSource} columns={columns} bordered />;
};
