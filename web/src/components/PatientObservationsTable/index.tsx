import { Table } from 'antd';
import React from 'react';

import { Observation } from 'shared/src/contrib/aidbox';

import { formatHumanDateTime } from 'src/utils/date';

interface Props {
    observationList: Observation[];
}

export const PatientObservationsTable = ({ observationList }: Props) => {
    const dataSource = observationList.map((observation) => {
        return {
            key: observation.id,
            id: <div>{observation.id}</div>,
            code: (
                <div>
                    <div>{observation.code.coding?.[0].display}</div>
                    <div>{observation.code.coding?.[0].code}</div>
                </div>
            ),
            quantity: (
                <div>{`${observation.value?.Quantity?.value} ${observation.value?.Quantity?.unit}`}</div>
            ),
            datetime: <div>{formatHumanDateTime(observation.effective?.dateTime)}</div>,
            status: <div>{observation.status}</div>,
        };
    });

    const columns = [
        {
            title: <b>Id</b>,
            dataIndex: 'id',
            key: 'id',
            width: '20%',
            align: 'center' as 'center',
        },
        {
            title: <b>Code</b>,
            dataIndex: 'code',
            key: 'code',
            width: '50%',
            align: 'center' as 'center',
        },
        {
            title: <b>Quantity</b>,
            dataIndex: 'quantity',
            key: 'quantity',
            width: '10%',
            align: 'center' as 'center',
        },
        {
            title: <b>Datetime</b>,
            dataIndex: 'datetime',
            key: 'datetime',
            width: '10%',
            align: 'center' as 'center',
        },
        {
            title: <b>Status</b>,
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            align: 'center' as 'center',
        },
    ];

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} bordered />
        </div>
    );
};
