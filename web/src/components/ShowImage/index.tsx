import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure } from 'aidbox-react/src/libs/remoteData';
import { service } from 'aidbox-react/src/services/service';

import { RenderRemoteData } from '../RenderRemoteData';
import s from './ShowImage.module.scss';

interface ShowImageProps {
    fileKey: string;
}

export const ShowImage = ({ fileKey }: ShowImageProps) => {
    const { imageRD } = useShowImage({ fileKey });

    return (
        <RenderRemoteData
            remoteData={imageRD}
            renderFailure={() => <div>image preview is not available</div>}
        >
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
