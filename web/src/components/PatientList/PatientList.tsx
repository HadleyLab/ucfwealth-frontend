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
        },
        {
            title: <b>Questionnaires</b>,
            dataIndex: 'questionnaires',
            key: 'questionnaires',
        },
        {
            title: <b>Last Activity</b>,
            dataIndex: 'lastActivity',
            key: 'lastActivity',
        },
        {
            title: <b>Dicom Files</b>,
            dataIndex: 'dicomFiles',
            key: 'dicomFiles',
        },
        {
            title: <b>Details</b>,
            dataIndex: 'details',
            key: 'details',
        },
    ];

    return (
        <div>
            <div className={s.progress}>
                Progress: <b>{patientList.length}</b> participants total
            </div>
            <Table dataSource={dataSource} columns={columns} />
        </div>
    );
};
