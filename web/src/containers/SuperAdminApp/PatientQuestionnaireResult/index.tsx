import './styles.css';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { useHistory } from 'react-router-dom';

import { LeftArrowIcon } from 'src/images/LeftArrowIcon';

import s from './PatientQuestionnaireResult.module.scss';
import { usePatientQuestionnaireResult } from './usePatientQuestionnaireResult';

export const PatientQuestionnaireResult = () => {
    const { patient, questionnaire } = usePatientQuestionnaireResult();

    const history = useHistory();

    return (
        <div>
            <div className={s.headerWrapper}>
                <div onClick={() => history.goBack()} className={s.leftArrow}>
                    <LeftArrowIcon />
                </div>
                <div className={s.patientDetails}>
                    <div className={s.patient}>{patient.email}</div>
                    <div className={s.details}>Participant Details</div>
                </div>
            </div>
            <div className={s.codeMirrorWrapper}>
                {patient.questionnaireList && patient.questionnaireList.length > 0 ? (
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
        </div>
    );
};
