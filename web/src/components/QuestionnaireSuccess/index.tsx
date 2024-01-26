import { FileUploader } from 'src/containers/FileUploader/App';
import { SuccessIcon } from 'src/images/SuccessIcon';

import s from './QuestionnaireSuccess.module.scss';

export const QuestionnaireSuccess = () => {
    return (
        <div className={s.wrapper}>
            <SuccessIcon />
            <div className={s.thankYou}>
                <div className={s.whatsNext}>What's next?</div>
                <div className={s.step}>
                    Do you have a CD with the DICOM images?
                    <br />
                    If so, please upload it into the system.
                </div>
                <FileUploader />
            </div>
        </div>
    );
};
