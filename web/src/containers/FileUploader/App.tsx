import { FileList } from './components/FileList';
import { SessionId } from './components/SessionId';
import { Upload } from './components/Upload';
import { useApp } from './hooks/useApp'

import './index.css';

export const FileUploader = () => {
    const { getData, showLoader, contentList } = useApp();

    return (
        <main className="App mt-12">
            <section className="container mx-auto max-w-screen-md px-6">
                <h1 className="text-left font-black	text-3xl pl-6">File uploader</h1>
                <div className="mt-4 px-6">
                    Please, upload your CD with images. This step is optional in case you already
                    has this data.
                </div>
                <div className="bg-white rounded-full borderStyle p-6 mt-6 pt-2">
                    <Upload getData={getData} />
                </div>
            </section>
            <section className="container mx-auto max-w-screen-md px-6 my-4">
                <SessionId />
            </section>
            <section className="container mx-auto max-w-screen-md px-6 mb-16">
                <div className="bg-white rounded-full borderStyle p-6 mt-4 pt-4">
                    <FileList showLoader={showLoader} contentList={contentList} />
                </div>
            </section>
        </main>
    );
}
