import { Button } from 'antd';

import { DicomSummary } from 'src/components/DicomSummary';
import { QuestionnaireSummary } from 'src/components/QuestionnaireSummary';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { FILE_UPLOADER_FRONTEND_URL } from 'src/config.url';

import s from './SummaryOverview.module.scss';
import { useSummaryOverview } from './useSummaryOverview';

export const SummaryOverview = () => {
    const {
        fileListRD,
        questionnaireListMapRD,
        patientId,
        goToQuestionnaire,
        getQuestionnaireSummary,
    } = useSummaryOverview();

    return (
        <div className={s.wrapper}>
            <h2 className={s.title}>Summary Overview</h2>
            <div className={s.sectionWrapper}>
                <div className={s.subTitle}>Questionaire Progress</div>
                <div>
                    <RenderRemoteData
                        remoteData={questionnaireListMapRD}
                        renderFailure={() => <div>Questionnaire list not found</div>}
                    >
                        {(questionnaireListMap) => (
                            <QuestionnaireSummary
                                questionnaireListMap={questionnaireListMap}
                                getQuestionnaireSummary={getQuestionnaireSummary}
                            />
                        )}
                    </RenderRemoteData>
                </div>
                <Button onClick={goToQuestionnaire} type="primary" className={s.button}>
                    COVID-19 Questionnaire
                </Button>
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
                <Button
                    type="primary"
                    href={`${FILE_UPLOADER_FRONTEND_URL}/${patientId}`}
                    className={s.button}
                >
                    Upload images
                </Button>
            </div>
        </div>
    );
};
