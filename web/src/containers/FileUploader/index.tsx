import { FileList } from './components/FileList';
import { Upload } from './components/Upload';
import { useFileUploader } from './hooks/useFileUploader';

import './index.css';

interface Props {
    showFileList?: boolean;
    setFileListCoordinator?: (array: string[]) => void;
}

export const FileUploader = ({ showFileList = true, setFileListCoordinator = () => {} }: Props) => {
    const { getData, showLoader, contentList } = useFileUploader();

    return (
        <main>
            <section>
                <Upload getData={getData} setFileListCoordinator={setFileListCoordinator} />
            </section>
            {showFileList && (
                <section style={{ fontSize: 14, fontWeight: 600 }}>
                    <FileList showLoader={showLoader} contentList={contentList} />
                </section>
            )}
        </main>
    );
};
