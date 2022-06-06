import { Spin } from 'antd';
import React from 'react';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';

import { PatientDataInfo } from 'src/components/PatientDataInfo';
import { TimelineSection } from 'src/components/TimelineSection/TimelineSection';

import s from './PatientData.module.scss';
import { usePatientData } from './usePatientData';
import { useTimeline } from './useTimeline';

export const PatientData = () => {
    const { patientResourceRD, patientInfoRD } = usePatientData();
    const { checkedList, indeterminate, checkAll, plainOptions, timelineManager } = useTimeline();

    return (
        <div className={s.container}>
            <RenderRemoteData remoteData={patientResourceRD} renderLoading={() => <Spin />}>
                {(patient) => <PatientDataInfo patient={patient} />}
            </RenderRemoteData>
            <RenderRemoteData remoteData={patientInfoRD} renderLoading={() => <Spin />}>
                {(data) => (
                    <TimelineSection
                        data={data}
                        checkedList={checkedList}
                        indeterminate={indeterminate}
                        checkAll={checkAll}
                        plainOptions={plainOptions}
                        timelineManager={timelineManager}
                    />
                )}
            </RenderRemoteData>
        </div>
    );
};
