import { FileList } from './components/FileList';
import { Upload } from './components/Upload';
import { useApp } from './hooks/useApp';

import './index.css';

export const FileUploader = () => {
    const { getData, showLoader, contentList } = useApp();

    return (
        <main>
            <section>
                <Upload getData={getData} />
            </section>
            <section style={{ fontSize: 14, fontWeight: 600 }}>
                <FileList showLoader={showLoader} contentList={contentList} />
            </section>
        </main>
    );
};
