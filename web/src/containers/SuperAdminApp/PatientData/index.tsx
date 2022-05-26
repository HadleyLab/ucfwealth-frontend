import { Spin } from 'antd';
import React from 'react';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';

import { PatientDataInfo } from 'src/components/PatientDataInfo';
import { PatientDiagnosticReportsTable } from 'src/components/PatientDiagnosticReportsTable';
import { PatientObservationsTable } from 'src/components/PatientObservationsTable';

import s from './PatientData.module.scss';
import { usePatientData } from './usePatientData';

export const PatientData = () => {
    const { patientResourceRD, observationListRD, diagnosticReportListRD } = usePatientData();

    return (
        <div className={s.container}>
            <h3 className={s.title}>Patient data</h3>
            <RenderRemoteData remoteData={patientResourceRD} renderLoading={() => <Spin />}>
                {(patient) => <PatientDataInfo patient={patient} />}
            </RenderRemoteData>
            <h3 className={s.link}>Observations</h3>
            <RenderRemoteData remoteData={observationListRD} renderLoading={() => <Spin />}>
                {(observationList) => (
                    <PatientObservationsTable observationList={observationList} />
                )}
            </RenderRemoteData>
            <h3 className={s.link}>Diagnostic Reports</h3>
            <RenderRemoteData remoteData={diagnosticReportListRD} renderLoading={() => <Spin />}>
                {(diagnosticReportList) => (
                    <PatientDiagnosticReportsTable diagnosticReportList={diagnosticReportList} />
                )}
            </RenderRemoteData>
        </div>
    );
};
