import { Button, Spin } from 'antd';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';

import { fileUploaderUrl } from 'src/config.url';

import { DicomSummary } from './DicomSummary';
import { QuestionnaireSummary } from './QuestionnaireSummary';
import { useSummaryOverview } from './useSummaryOverview';

export const SummaryOverview = () => {
    const { fileListRD, questionnaireListRD, patientId, goToQuestionnaire } = useSummaryOverview();

    return (
        <div>
            <h2>Summary overview</h2>
            <h3>Questionnaire status:</h3>
            <RenderRemoteData
                remoteData={questionnaireListRD}
                renderLoading={() => <Spin />}
                renderFailure={() => <div>Questionnaire list not found</div>}
            >
                {(data) => <QuestionnaireSummary data={data} />}
            </RenderRemoteData>
            <Button onClick={goToQuestionnaire} type="primary">
                COVID-19 Questionnaire
            </Button>
            <h3>Dicom files:</h3>
            <RenderRemoteData
                remoteData={fileListRD}
                renderLoading={() => <Spin />}
                renderFailure={() => <div>File list not found</div>}
            >
                {(data) => <DicomSummary data={data} />}
            </RenderRemoteData>
            <Button type="primary" href={`${fileUploaderUrl}/${patientId}`}>
                Upload images
            </Button>
        </div>
    );
};
