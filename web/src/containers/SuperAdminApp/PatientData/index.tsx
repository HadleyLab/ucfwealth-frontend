import { PatientDataInfo } from 'src/components/PatientDataInfo';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { TimelineSection } from 'src/components/TimelineSection/TimelineSection';

import s from './PatientData.module.scss';
import { usePatientData } from './usePatientData';
import { useTimeline } from './useTimeline';

export const PatientData = () => {
    const { patientResourceRD, patientInfoRD } = usePatientData();
    const { checkedList, indeterminate, checkAll, plainOptions, timelineManager } = useTimeline();

    return (
        <div className={s.container}>
            <RenderRemoteData remoteData={patientResourceRD}>
                {(patient) => <PatientDataInfo patient={patient} />}
            </RenderRemoteData>
            <RenderRemoteData remoteData={patientInfoRD}>
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
