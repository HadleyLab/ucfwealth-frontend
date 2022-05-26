import { Table } from 'antd';
import React from 'react';

import { Condition } from 'shared/src/contrib/aidbox';

interface Props {
    conditionList: Condition[];
}

export const PatientConditionsTable = ({ conditionList }: Props) => {
    const dataSource = conditionList.map((condition) => {
        return {
            key: condition.id,
            id: <div>{condition.id}</div>,
            category: <div>{condition.category?.[0].coding?.[0].display}</div>,
            code: <div>{condition.code?.coding?.[0].display}</div>,
            status: <div>{condition.verificationStatus?.coding?.[0].code}</div>,
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
            title: <b>Category</b>,
            dataIndex: 'category',
            key: 'category',
            width: '30%',
            align: 'center' as 'center',
        },
        {
            title: <b>Code</b>,
            dataIndex: 'code',
            key: 'code',
            width: '30%',
            align: 'center' as 'center',
        },
        {
            title: <b>Verification Status</b>,
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            align: 'center' as 'center',
        },
    ];

    return <Table dataSource={dataSource} columns={columns} bordered />;
};
