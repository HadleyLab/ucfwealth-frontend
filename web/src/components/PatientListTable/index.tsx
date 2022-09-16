import { Table } from 'antd';
import { useHistory } from 'react-router-dom';

import { Patient } from 'shared/src/contrib/aidbox';

import s from './PatientListTable.module.scss';

interface Props {
    patientList: Patient[];
}

export const PatientListTable = ({ patientList }: Props) => {
    const history = useHistory();

    const goToPatientData = (patient: Patient) =>
        history.push({ pathname: `/patients/${patient.id}/data` });

    const dataSource = patientList.map((patient: Patient) => {
        return {
            key: patient.id,
            patient: (
                <div onClick={() => goToPatientData(patient)} className={s.link}>
                    {patient.name
                        ? String(patient.name[0].family).toLowerCase()
                        : patient.id}
                </div>
            ),
        };
    });

    const columns = [
        {
            title: <b>Patient</b>,
            dataIndex: 'patient',
            key: 'patient',
            width: '100%',
        },
    ];

    return (
        <div className={s.container}>
            <h3 className={s.title}>Patient list</h3>
            <Table dataSource={dataSource} columns={columns} bordered />
        </div>
    );
};
