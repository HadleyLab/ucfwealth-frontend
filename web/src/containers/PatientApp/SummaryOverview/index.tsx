import { Button } from 'antd';

import { DicomSummary } from 'src/components/DicomSummary';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { QuestionnaireSummary } from 'src/containers/PatientApp/QuestionnaireSummary';

import s from './SummaryOverview.module.scss';
import { useSummaryOverview } from './useSummaryOverview';

export const SummaryOverview = () => {
    const {
        fileListRD,
        questionnaireListMapRD,
        patientId,
        goToQuestionnaire,
        getQuestionnaireSummary,
        onClickUpload,
    } = useSummaryOverview();

    return (
        <div className={s.wrapper}>
            <h2 className={s.title}>Summary Overview</h2>
            <div className={s.sectionWrapper}>
                <div className={s.subTitle}>Questionnaire Progress</div>
                <div>
                    <RenderRemoteData
                        remoteData={questionnaireListMapRD}
                        renderFailure={() => <div>Questionnaire list not found</div>}
                    >
                        {(questionnaireListMap) => (
                            <QuestionnaireSummary
                                questionnaireListMap={questionnaireListMap}
                                getQuestionnaireSummary={getQuestionnaireSummary}
                                patientId={patientId}
                                goToQuestionnaire={goToQuestionnaire}
                            />
                        )}
                    </RenderRemoteData>
                </div>
            </div>
            <div className={s.sectionWrapper}>
                <div className={s.subTitle}>Dicom Files</div>
                <div>
                    <RenderRemoteData
                        remoteData={fileListRD}
                        renderFailure={() => <div>File list not found</div>}
                    >
                        {(data) => <DicomSummary data={data} />}
                    </RenderRemoteData>
                </div>
                <Button type="primary" onClick={onClickUpload} className={s.button}>
                    Upload images
                </Button>
            </div>
        </div>
    );
};
