import Uploady from '@rpldy/uploady';

import { HederaAccountModal } from './HederaAccountModal';
import { SignedUploadDragAndDrop } from './SignedUploadDragAndDrop';
import { UploadProgress } from './UploadProgress';
import { useUpload } from './useUpload';
import './Upload.css';

interface UploadProps {
    getData: () => Promise<any>;
    setFileListCoordinator: (array: string[]) => void;
}

export const Upload = ({ getData, setFileListCoordinator }: UploadProps) => {
    const {
        uploadFileName,
        setUploadFileName,
        showModal,
        setShowModal,
        accountCredentials,
        setAccountCredentials,
        createHederaAccount,
        filterByExtension,
    } = useUpload();

    return (
        <div className="upload-container">
            <HederaAccountModal
                accountCredentials={accountCredentials}
                showModal={showModal}
                setShowModal={setShowModal}
            />
            <Uploady
                fileFilter={filterByExtension}
                multiple
                destination={{
                    url: 'https://covid-imaging-develop.s3.us-west-1.amazonaws.com',
                }}
            >
                <UploadProgress
                    getData={getData}
                    uploadFileName={uploadFileName}
                    setAccountCredentials={setAccountCredentials}
                    setShowModal={setShowModal}
                    createHederaAccount={createHederaAccount}
                    setFileListCoordinator={setFileListCoordinator}
                />
                <SignedUploadDragAndDrop setUploadFileName={setUploadFileName} />
            </Uploady>
        </div>
    );
};
