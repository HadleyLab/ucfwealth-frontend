import { Button, Spin } from 'antd';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';

import { fileUploaderUrl } from 'src/config.url';
import { downloadFile, removePatientIdFromFileKey } from 'src/utils/patientFileList';

import { useSummaryOverview } from './useSummaryOverview';

export const SummaryOverview = () => {
    let match = useRouteMatch();
    const history = useHistory();

    const { fileListRD, patientId } = useSummaryOverview();

    const goToQuestionnaire = () => history.push({ pathname: `${match.url}/questionnaire` });

    return (
        <div>
            <h2>Summary overview</h2>
            <div>-----</div>
            <h3>Questionnaire status:</h3>
            <div>Step 1: OK</div>
            <div>Step 2: None</div>
            <div>-----</div>
            <Button onClick={goToQuestionnaire} type="primary">
                COVID-19 Questionnaire
            </Button>
            <div>-----</div>
            <h3>Dicom files:</h3>
            <div>-----</div>
            <RenderRemoteData remoteData={fileListRD} renderLoading={() => <Spin />}>
                {(data) => (
                    <div>
                        {data.dicomFileList.length > 0 ? (
                            data.dicomFileList.map((fileKey: string, key: string) => (
                                <div
                                    key={key}
                                    onClick={() => downloadFile(fileKey)}
                                >
                                    {removePatientIdFromFileKey(fileKey)}
                                </div>
                            ))
                        ) : (
                            <div>Empty</div>
                        )}
                        <div>-----</div>
                        <Button
                            type="primary"
                            href={`${fileUploaderUrl}/${patientId}`}
                        >
                            Upload images
                        </Button>
                    </div>
                )}
            </RenderRemoteData>
        </div>
    );
};
