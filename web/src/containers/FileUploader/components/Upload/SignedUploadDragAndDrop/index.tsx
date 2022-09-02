import UploadButton from '@rpldy/upload-button';
import UploadDropZone from '@rpldy/upload-drop-zone';
import { CreateOptions } from '@rpldy/uploader';
import { useRequestPreSend } from '@rpldy/uploady';
import { Button } from 'antd';

import { isFailure } from 'aidbox-react/src/libs/remoteData';
import { service } from 'aidbox-react/src/services/service';

import { sharedPatientId } from 'src/sharedState';

interface Props {
    setUploadFileName: (uploadFileName: string) => void;
}

export const SignedUploadDragAndDrop = ({ setUploadFileName }: Props) => {
    const requestPreSend = async (requestData: { items: string | any[] }) => {
        if (requestData.items.length === 0) {
            console.error('items.length < 0');
            return;
        }
        const files = requestData.items[0];

        const { file } = files;
        const { name, type } = file;

        setUploadFileName(name);

        const patientId = sharedPatientId.getSharedState().id;

        const response = await service({
            method: 'GET',
            url: '/api/sign',
            params: {
                name: `${patientId}/${name}`,
                type,
            },
        });

        if (isFailure(response)) {
            console.log(response)
            return {};
        }

        const { data } = response;

        const options: CreateOptions = {
            sendWithFormData: false,
            destination: {
                url: data.url,
                method: 'PUT',
            },
        };

        return {
            options,
        };
    };

    useRequestPreSend(requestPreSend as any);

    return (
        <UploadDropZone
            className="drag-and-drop"
            onDragOverClassName="drag-over"
            htmlDirContentParams={{ recursive: true, withFullPath: true }}
        >
            <span className="drag-and-drop-your-files-text">
                Drag and drop your files anywhere or
            </span>
            <UploadButton className="upload-button-container">
                <Button type="primary" className="upload-button">
                    Click To Upload!
                </Button>
            </UploadButton>
        </UploadDropZone>
    );
};
