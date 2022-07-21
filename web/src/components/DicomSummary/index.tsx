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
                    <div className={s.title} key={key} onClick={() => downloadFile(fileKey)}>
                        {removePatientIdFromFileKey(fileKey)}
                    </div>
                ))
            ) : (
                <div className={s.empty}>Empty</div>
            )}
        </div>
    );
};
