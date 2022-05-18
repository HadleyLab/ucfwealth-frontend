import { Table } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { ExtendedPatient } from 'src/containers/SuperAdminApp/PatientListContainer/usePatientList';
import { RightArrowIcon } from 'src/images/RightArrowIcon';
import { formatHumanDateTime } from 'src/utils/date';

import s from './PatientList.module.scss';
import { QuestionnaireAvailable } from './QuestionnaireAvailable';

interface Props {
    patientList: ExtendedPatient[];
}

export const PatientList = ({ patientList }: Props) => {
    const history = useHistory();

    const goToDetails = (patient: ExtendedPatient) =>
        history.push({
            pathname: `/patients/${patient.id}`,
            state: { patient },
        });

    const goToPatientFileList = (patient: ExtendedPatient) =>
        history.push({ pathname: `/patients/${patient.id}/files` });

    const dataSource = patientList.map((patient: ExtendedPatient) => {
        return {
            key: patient.id,
            questionnaires: <QuestionnaireAvailable questionnaire={patient.questionnaire} />,
            participant: patient.email,
            lastActivity: formatHumanDateTime(patient.lastActivity),
            dicomFiles: (
                <div onClick={() => goToPatientFileList(patient)}>
                    <div className={s.rightArrow}>File List</div>
                </div>
            ),
            details: (
                <div onClick={() => goToDetails(patient)}>
                    <div className={s.rightArrow}>
                        <RightArrowIcon />
                    </div>
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
