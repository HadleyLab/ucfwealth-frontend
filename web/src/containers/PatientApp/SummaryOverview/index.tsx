import { Button, Spin } from 'antd';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';

import { fileUploaderUrl } from 'src/config.url';
import { downloadFile, removePatientIdFromFileKey } from 'src/utils/patientFileList';

import { QuestionnaireSummary } from './QuestionnaireSummary';
import { useSummaryOverview } from './useSummaryOverview';

export const SummaryOverview = () => {
    let match = useRouteMatch();
    const history = useHistory();

    const { fileListRD, questionnaireListRD, patientId } = useSummaryOverview();

    const goToQuestionnaire = () => history.push({ pathname: `${match.url}/questionnaire` });

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
                {(data) => (
                    <div>
                        {data.dicomFileList.length > 0 ? (
                            data.dicomFileList.map((fileKey: string, key: string) => (
                                <div key={key} onClick={() => downloadFile(fileKey)}>
                                    {removePatientIdFromFileKey(fileKey)}
                                </div>
                            ))
                        ) : (
                            <div>Empty</div>
                        )}
                    </div>
                )}
            </RenderRemoteData>
            <Button type="primary" href={`${fileUploaderUrl}/${patientId}`}>
                Upload images
            </Button>
        </div>
    );
};
