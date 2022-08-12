import UploadButton from '@rpldy/upload-button';
import UploadDropZone from '@rpldy/upload-drop-zone';
import { CreateOptions } from '@rpldy/uploader';
import { useRequestPreSend } from '@rpldy/uploady';
import axios from 'axios';

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

        const gateway = window.gateway ?? 'http://localhost:8083';

        const sessionId = localStorage.getItem('sessionId');

        const response = await axios(
            `${gateway}/api/sign?` +
                new URLSearchParams({
                    name: `${sessionId}/${name}`,
                    type,
                }),
        );

        const { data } = response;

        const options: CreateOptions = {
            sendWithFormData: false,
            destination: {
                url: data,
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
            className="drag-and-drop border-dashed border-2 borderDashedColor w-64 h-32 rounded justify-center items-center flex flex-col"
            onDragOverClassName="drag-over"
            htmlDirContentParams={{ recursive: true, withFullPath: true }}
        >
            <span className="block mb-4">Drag and drop your files anywhere or</span>
            <UploadButton className="py-2 px-4 font-semibold rounded-full text-white buttonStyle">
                Click To Upload!
            </UploadButton>
        </UploadDropZone>
    );
};
