import { ShowImage } from 'src/components/ShowImage';
import { sharedPatientId } from 'src/sharedState';
import { downloadFile } from 'src/utils/patientFileList';

interface Props {
    data: any;
}

import s from './DicomSummary.module.scss';

export const DicomSummary = ({ data }: Props) => {
    const patientId = sharedPatientId.getSharedState().id;
    return (
        <div>
            {data.dicomFileList.length > 0 ? (
                data.dicomFileList.map((fileName: string, key: string) => (
                    <div>
                        <div className={s.title} key={key} onClick={() => downloadFile(`${patientId}/${fileName}`)}>
                            {fileName}
                        </div>
                        <div className={s.showImage}>
                            <ShowImage fileKey={`${patientId}/${fileName}`} />
                        </div>
                    </div>
                ))
            ) : (
                <div className={s.empty}>Empty</div>
            )}
        </div>
    );
};
