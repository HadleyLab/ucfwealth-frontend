import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { ExtendedPatient } from 'src/containers/SuperAdminApp/PatientProgressList/usePatientProgressList';
import { QuestionnaireAvailableBadge } from 'src/containers/SuperAdminApp/QuestionnaireAvailableBadge';
import { RightArrowIcon } from 'src/images/RightArrowIcon';
import { formatHumanDateTime } from 'src/utils/date';

import s from './PatientProgressListTable.module.scss';

interface Props {
    patientList: ExtendedPatient[];
    patientCount?: number;
}

export const PatientProgressListTable = ({ patientList, patientCount }: Props) => {
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

    const showQuestionnaireTitle = (questionnaireList?: any[]) => {
        if (questionnaireList) {
            const questionnaireNameList = questionnaireList.map(
                (questionnaire) => questionnaire.resource?.questionnaire,
            );
            if (questionnaireNameList.indexOf('screening-questions') >= 0) {
                return 'COVID-19';
            }
            if (questionnaireNameList.indexOf('patient-report-baseline') >= 0) {
                return 'Breast Cancer';
            }
            if (questionnaireNameList.indexOf('survival-and-disease-control') >= 0) {
                return 'Survival and Disease';
            }
        }
        return 'Did not join';
    };

    const dataSource = patientList.map((patient: ExtendedPatient) => {
        return {
            key: patient.id,
            research: <div>{showQuestionnaireTitle(patient.questionnaireList)}</div>,
            questionnaires: (
                <QuestionnaireAvailableBadge
                    questionnaireList={patient.questionnaireList}
                    patientId={patient.id ? patient.id : ''}
                />
            ),
            participant: <div style={{ lineBreak: 'anywhere' }}>{patient.email}</div>,
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
            width: '30%',
            align: 'center' as 'center',
        },
        {
            title: <b>Research</b>,
            dataIndex: 'research',
            key: 'research',
            width: '15%',
            align: 'center' as 'center',
            filters: [
                {
                    text: 'COVID-19 research',
                    value: 'screening-questions',
                },
                {
                    text: 'Breast Cancer research',
                    value: 'patient-report-baseline',
                },
                {
                    text: 'Survival and Disease control',
                    value: 'survival-and-disease-control',
                },
            ],
            onFilter: (
                value: any,
                record: {
                    key: any;
                    questionnaires: { props: { questionnaireList: any[] } };
                },
            ) => {
                const questionnaireNameList = record.questionnaires.props.questionnaireList.map(
                    (questionnaire) => questionnaire.resource?.questionnaire,
                );
                return questionnaireNameList.indexOf(value) >= 0;
            },
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
            width: '10%',
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
