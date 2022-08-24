import './styles.css';
import { useHistory, useLocation } from 'react-router-dom';

import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { QuestionnaireFormWrapper } from 'src/containers/PatientApp/QuestionnaireFormWrapper';
import { LeftArrowIcon } from 'src/images/LeftArrowIcon';

import s from './PatientQuestionnaireResult.module.scss';
import { usePatientQuestionnaireResult } from './usePatientQuestionnaireResult';

export const PatientQuestionnaireResult = () => {
    const { patientRD } = usePatientQuestionnaireResult();

    const history = useHistory();

    const location = useLocation<any>();

    const pageNumber = location.state.pageNumber;

    return (
        <div>
            <RenderRemoteData remoteData={patientRD}>
                {(patient) => {
                    return (
                        <div style={{ display: 'flex' }}>
                            <div
                                onClick={() =>
                                    history.push('/app', { pageNumber: pageNumber ?? 1 })
                                }
                                className={s.leftArrow}
                            >
                                <LeftArrowIcon />
                            </div>
                            <div style={{ width: '1100px' }}>
                                <QuestionnaireFormWrapper patient={patient} isSaveDisabled={true} />
                            </div>
                        </div>
                    );
                }}
            </RenderRemoteData>
        </div>
    );
};
