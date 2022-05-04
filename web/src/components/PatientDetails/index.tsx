import './styles.css';
import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

import { usePatientDetails } from './usePatientDetails';

export const PatientDetails = () => {
    const { patient, questionnaire } = usePatientDetails();

    return (
        <div>
            <div className="patientDetails">
                <div className="patient">{patient.email}</div>
                <div className="details">Participant Details</div>
            </div>
            {patient.questionnaire ? (
                <CodeMirror
                    value={questionnaire}
                    options={{
                        lineNumbers: false,
                        mode: 'yaml',
                        readOnly: true,
                    }}
                />
            ) : (
                <div>Empty</div>
            )}
        </div>
    );
};
