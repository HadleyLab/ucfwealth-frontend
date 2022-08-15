import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure } from 'aidbox-react/src/libs/remoteData';
import { service } from 'aidbox-react/src/services/service';

import { RenderRemoteData } from 'src/components/RenderRemoteData';
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

interface ShowImageProps {
    fileKey: string;
}

const ShowImage = ({ fileKey }: ShowImageProps) => {
    const { imageRD } = useShowImage({ fileKey });

    return (
        <RenderRemoteData remoteData={imageRD}>
            {(data) => <img src={`data:image/png;base64,${data}`} className={s.image} />}
        </RenderRemoteData>
    );
};

const useShowImage = ({ fileKey }: { fileKey: string }) => {
    const [imageRD] = useService(async () => {
        const response = await service({
            method: 'GET',
            url: '$get-png-image-base64',
            params: { key: fileKey },
        });

        if (isFailure(response)) {
            console.log(response.status, response.error);
            return response;
        }

        return response;
    }, []);

    return { imageRD };
};
