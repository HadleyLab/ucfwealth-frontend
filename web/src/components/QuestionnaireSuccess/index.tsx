import { SuccessIcon } from 'src/images/SuccessIcon';
import { sharedPatientId } from 'src/sharedState';

import s from './QuestionnaireSuccess.module.scss';

export const QuestionnaireSuccess = () => {
    const patientId = sharedPatientId.getSharedState();
    return (
        <div className={s.wrapper}>
            <SuccessIcon />
            <div className={s.thankYou}>
                Thank you!
                <br />
                Please upload your DICOM files{' '}
                <a href={`https://uci.beda.software/${patientId.id}`}>here</a>
            </div>
        </div>
    );
};
