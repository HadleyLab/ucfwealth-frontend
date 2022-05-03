import './styles.css';
import { Spin } from 'antd';
import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';

import { objectToDisplay } from 'src/utils/questionnaire';

import { usePatientDetails } from './usePatientDetails';

export const PatientDetails = () => {
    const { questionnaireResponseRD, patient } = usePatientDetails();

    return (
        <div>
            <div className="patientDetails">
                <div className="patient">{patient.name?.[0].text}</div>
                <div className="details">Participant Details</div>
            </div>

            <RenderRemoteData
                remoteData={questionnaireResponseRD}
                renderLoading={() => <Spin />}
                renderFailure={(error) => <div>{JSON.stringify(error)}</div>}
            >
                {(questionnaireResponse) => {
                    if (questionnaireResponse.entry && questionnaireResponse.entry.length > 0) {
                        const questionnaire = objectToDisplay(questionnaireResponse.entry?.[0]!);
                        return (
                            <CodeMirror
                                value={questionnaire}
                                options={{
                                    lineNumbers: false,
                                    mode: 'yaml',
                                    readOnly: true,
                                }}
                            />
                        );
                    }
                    return <div>empty</div>;
                }}
            </RenderRemoteData>
        </div>
    );
};
