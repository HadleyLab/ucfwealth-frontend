import './styles.css';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { useHistory, useLocation } from 'react-router-dom';

import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { LeftArrowIcon } from 'src/images/LeftArrowIcon';
import { objectToDisplay } from 'src/utils/questionnaire';

import s from './PatientQuestionnaireResult.module.scss';
import { usePatientQuestionnaireResult } from './usePatientQuestionnaireResult';

export const PatientQuestionnaireResult = () => {
    const { questionnaireResponseListRD, patientId } = usePatientQuestionnaireResult();

    const history = useHistory();

    const location = useLocation<any>();

    const pageNumber = location.state.pageNumber;

    return (
        <div>
            <div className={s.headerWrapper}>
                <div
                    onClick={() => history.replace('/', { pageNumber: pageNumber ?? 1 })}
                    className={s.leftArrow}
                >
                    <LeftArrowIcon />
                </div>
                <div className={s.patientDetails}>
                    <div className={s.patient}>{patientId}</div>
                    <div className={s.details}>Participant Details</div>
                </div>
            </div>
            <div className={s.codeMirrorWrapper}>
                <RenderRemoteData remoteData={questionnaireResponseListRD}>
                    {(questionnaireResponseList) => {
                        return (
                            <>
                                {questionnaireResponseList.length > 0 ? (
                                    <CodeMirror
                                        value={objectToDisplay(questionnaireResponseList)}
                                        options={{
                                            lineNumbers: false,
                                            mode: 'yaml',
                                            readOnly: true,
                                        }}
                                    />
                                ) : (
                                    <div>Empty</div>
                                )}
                            </>
                        );
                    }}
                </RenderRemoteData>
            </div>
        </div>
    );
};
