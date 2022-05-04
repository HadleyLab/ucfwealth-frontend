import { Table } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { Patient } from 'shared/src/contrib/aidbox';

import { RightArrowIcon } from 'src/images/RightArrowIcon';

import { LastActivity } from './LastActivity';
import s from './PatientList.module.scss';
import { Questionnaires } from './Questionnaires';

interface Props {
    patientList: Patient[];
}

export const PatientList = ({ patientList }: Props) => {
    const history = useHistory();

    // TODO refactor questionnaireResponseRD in one request
    const dataSource = patientList.map((patient) => {
        return {
            key: patient.id,
            questionnaires: <Questionnaires patient={patient} />,
            participant: patient.name?.[0].text,
            lastActivity: <LastActivity patient={patient} />,
            dicomFiles: 'empty',
            details: (
                <div
                    onClick={() =>
                        history.push({
                            pathname: `/patients/${patient.id}`,
                            state: { patient },
                        })
                    }
                >
                    {
                        <div className={s.rightArrow}>
                            <RightArrowIcon />
                        </div>
                    }
                </div>
            ),
        };
    });

    const columns = [
        {
            title: <b>Participant</b>,
            dataIndex: 'participant',
            key: 'participant',
            width: '20%',
            align: 'center' as 'center',
        },
        {
            title: <b>Questionnaires</b>,
            dataIndex: 'questionnaires',
            key: 'questionnaires',
            width: '20%',
            align: 'center' as 'center',
        },
        {
            title: <b>Last Activity</b>,
            dataIndex: 'lastActivity',
            key: 'lastActivity',
            width: '20%',
            align: 'center' as 'center',
        },
        {
            title: <b>Dicom Files</b>,
            dataIndex: 'dicomFiles',
            key: 'dicomFiles',
            width: '20%',
            align: 'center' as 'center',
        },
        {
            title: <b>Details</b>,
            dataIndex: 'details',
            key: 'details',
            width: '20%',
            align: 'center' as 'center',
        },
    ];

    return (
        <div className={s.container}>
            <div className={s.progress}>
                <div className={s.progressTitle}>Progress</div>
                <div className={s.totalContainer}>
                    <div className={s.totalCount}>{patientList.length}</div>
                    <div className={s.totalAbout}>participants total</div>
                </div>
            </div>
            <Table dataSource={dataSource} columns={columns} bordered />
        </div>
    );
};
