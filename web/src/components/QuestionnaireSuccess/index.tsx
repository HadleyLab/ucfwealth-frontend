
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
                    1. Do you have a CD with the DICOM images?
                    <br />
                    If so, please upload it into the system.
                </div>
                <div className={s.step}>
                    2. After the files are uploaded, you'll get your crypto wallet access.
                    <br />
                    Please, save it securely for future usage.
                </div>
                <div className={s.step}>
                    3. The study coordinator will review the files within a few days.
                    <br />
                    If the images fit into the study, you'll will receive an email with the access
                    to your NFT.
                </div>
                <FileUploader />
            </div>
        </div>
    );
};
