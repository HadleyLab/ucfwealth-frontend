import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Patient } from 'shared/src/contrib/aidbox';

import { ExtendedPatient } from 'src/containers/SuperAdminApp/PatientProgressList/usePatientProgressList';
import { QuestionnaireAvailableBadge } from 'src/containers/SuperAdminApp/QuestionnaireAvailableBadge';
import { RightArrowIcon } from 'src/images/RightArrowIcon';
import { formatHumanDateTime } from 'src/utils/date';

import { Celebrate } from './Celebrate';
import s from './PatientProgressListTable.module.scss';

interface Props {
    patientList: ExtendedPatient[];
    patientCount?: number;
    celebrate: (patient: Patient, setLoading: (loading: boolean) => void) => Promise<string>;
}

export const PatientProgressListTable = ({ patientList, patientCount, celebrate }: Props) => {
    const [tablePageNumber, setTablePageNumber] = useState<number | undefined>(1);

    const history = useHistory();

    const location = useLocation<any>();

    useEffect(() => {
        if (location.state?.pageNumber) {
            setTablePageNumber(location.state.pageNumber);
        }
    }, [location]);

    const goToDetails = (patient: ExtendedPatient) =>
        history.push({
            pathname: `/patients/${patient.id}`,
            state: { pageNumber: tablePageNumber },
        });

    const goToPatientFileList = (patient: ExtendedPatient) =>
        history.push({
            pathname: `/patients/${patient.id}/files`,
            state: { pageNumber: tablePageNumber },
        });

    const dataSource = patientList.map((patient: ExtendedPatient) => {
        return {
            key: patient.id,
            questionnaires: (
                <QuestionnaireAvailableBadge
                    questionnaireList={patient.questionnaireList}
                    patientId={patient.id ? patient.id : ''}
                />
            ),
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
            hedera: <Celebrate celebrate={celebrate} patient={patient} />,
        };
    });

    const columns = [
        {
            title: <b>Participant</b>,
            dataIndex: 'participant',
            key: 'participant',
            align: 'center' as 'center',
        },
        {
            title: <b>Questionnaires</b>,
            dataIndex: 'questionnaires',
            key: 'questionnaires',
            width: '15%',
            align: 'center' as 'center',
        },
        {
            title: <b>Last Activity</b>,
            dataIndex: 'lastActivity',
            key: 'lastActivity',
            width: '15%',
            align: 'center' as 'center',
        },
        {
            title: <b>Dicom Files</b>,
            dataIndex: 'dicomFiles',
            key: 'dicomFiles',
            width: '15%',
            align: 'center' as 'center',
        },
        {
            title: <b>Details</b>,
            dataIndex: 'details',
            key: 'details',
            width: '15%',
            align: 'center' as 'center',
        },
        {
            title: <b>Celebrate participant</b>,
            dataIndex: 'hedera',
            key: 'hedera',
            width: '15%',
            align: 'center' as 'center',
        },
    ];

    return (
        <div className={s.container}>
            <div className={s.progress}>
                <div className={s.progressTitle}>Progress</div>
                <div className={s.totalContainer}>
                    <div className={s.totalCount}>{patientCount}</div>
                    <div className={s.totalAbout}>participants total</div>
                </div>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey={(patient) => patient.key!}
                bordered
                pagination={{
                    current: tablePageNumber,
                    onChange: (i) => setTablePageNumber(i),
                }}
            />
        </div>
    );
};
