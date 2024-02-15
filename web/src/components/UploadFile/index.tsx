import { Button } from 'antd';

import { FileUploader } from 'src/containers/FileUploader';
import { SuccessIcon } from 'src/images/SuccessIcon';

import s from './UploadFile.module.scss';

interface Props {
    onContinue: () => Promise<void>;
}

export const UploadFile = ({ onContinue }: Props) => {
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
                <Button type="primary" onClick={onContinue}>
                    <span>Continue</span>
                </Button>
            </div>
        </div>
    );
};
