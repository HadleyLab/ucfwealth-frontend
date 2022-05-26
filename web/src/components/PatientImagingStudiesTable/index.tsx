/* eslint-disable dot-notation */
import { Table } from 'antd';
import React from 'react';

import { ImagingStudy } from 'shared/src/contrib/aidbox';

import { formatHumanDateTime } from 'src/utils/date';

interface Props {
    imagingStudyList: ImagingStudy[];
}

export const PatientImagingStudiesTable = ({ imagingStudyList }: Props) => {
    const dataSource = imagingStudyList.map((imagingStudy) => {
        return {
            key: imagingStudy.id,
            id: <div>{imagingStudy.id}</div>,
            createdAt: <div>{formatHumanDateTime(imagingStudy?.meta?.['createdAt'])}</div>,
            series: <div>{imagingStudy.series?.[0].bodySite?.display}</div>,
            modality: (
                <div>
                    {imagingStudy.series?.[0].modality.code +
                        ' ' +
                        imagingStudy.series?.[0].modality.display}
                </div>
            ),
            location: <div>{imagingStudy.location?.display}</div>,
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
            title: <b>Series</b>,
            dataIndex: 'series',
            key: 'series',
            width: '20%',
            align: 'center' as 'center',
        },
        {
            title: <b>Modality</b>,
            dataIndex: 'modality',
            key: 'modality',
            width: '20%',
            align: 'center' as 'center',
        },
        {
            title: <b>Location</b>,
            dataIndex: 'location',
            key: 'location',
            width: '20%',
            align: 'center' as 'center',
        },
        {
            title: <b>Created At</b>,
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '20%',
            align: 'center' as 'center',
        },
    ];

    return <Table dataSource={dataSource} columns={columns} bordered />;
};
