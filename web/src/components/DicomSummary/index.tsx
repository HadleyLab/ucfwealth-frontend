import { ShowImage } from 'src/components/ShowImage';
import { downloadFile, removePatientIdFromFileKey } from 'src/utils/patientFileList';

interface Props {
    data: any;
}

import s from './DicomSummary.module.scss';

export const DicomSummary = ({ data }: Props) => {
    return (
        <div>
            {data.dicomFileList.length > 0 ? (
                data.dicomFileList.map((fileKey: string, key: string) => (
                    <div>
                        <div className={s.title} key={key} onClick={() => downloadFile(fileKey)}>
                            {removePatientIdFromFileKey(fileKey)}
                        </div>
                        <div className={s.showImage}>
                            <ShowImage fileKey={fileKey} />
                        </div>
                    </div>
                ))
            ) : (
                <div className={s.empty}>Empty</div>
            )}
        </div>
    );
};
