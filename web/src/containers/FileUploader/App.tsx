import { FileList } from './components/FileList';
import { Upload } from './components/Upload';
import { useApp } from './hooks/useApp';

import './index.css';

interface Props {
    showFileList?: boolean;
    setFileListCoordinator?: (array: string[]) => void;
}

export const FileUploader = ({ showFileList = true, setFileListCoordinator = () => {} }: Props) => {
    const { getData, showLoader, contentList } = useApp();

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
