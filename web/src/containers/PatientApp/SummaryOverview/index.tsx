import { Button, Spin } from 'antd';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';

import { fileUploaderUrl } from 'src/config.url';

import { DicomSummary } from './DicomSummary';
import { QuestionnaireSummary } from './QuestionnaireSummary';
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
            <h2 className={s.title}>Summary overview</h2>
            <div className={s.sectionWrapper}>
                <h3>Questionnaire status:</h3>
                <RenderRemoteData
                    remoteData={questionnaireListMapRD}
                    renderLoading={() => <Spin />}
                    renderFailure={() => <div>Questionnaire list not found</div>}
                >
                    {(data) => (
                        <QuestionnaireSummary
                            data={data}
                            getQuestionnaireSummary={getQuestionnaireSummary}
                        />
                    )}
                </RenderRemoteData>
                <Button onClick={goToQuestionnaire} type="primary" className={s.button}>
                    COVID-19 Questionnaire
                </Button>
            </div>
            <div className={s.sectionWrapper}>
                <h3>Dicom files:</h3>
                <RenderRemoteData
                    remoteData={fileListRD}
                    renderLoading={() => <Spin />}
                    renderFailure={() => <div>File list not found</div>}
                >
                    {(data) => <DicomSummary data={data} />}
                </RenderRemoteData>
                <Button
                    type="primary"
                    href={`${fileUploaderUrl}/${patientId}`}
                    className={s.button}
                >
                    Upload images
                </Button>
            </div>
        </div>
    );
};
