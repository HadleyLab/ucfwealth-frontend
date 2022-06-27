import { Spin } from 'antd';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';

import s from './PatientFileList.module.scss';
import { usePatientFileList } from './usePatientFileList';

export const PatientFileList = () => {
    const { fileListRD, downloadFile, removePatientIdFromFileKey } = usePatientFileList();

    return (
        <>
            <div className={s.header}>Dicom Files</div>
            <RenderRemoteData remoteData={fileListRD} renderLoading={() => <Spin />}>
                {(data) => (
                    <div>
                        {data.dicomFileList.length > 0 ? (
                            data.dicomFileList.map((fileKey: string, key: string) => (
                                <div
                                    className={s.fileKey}
                                    key={key}
                                    onClick={() => downloadFile(fileKey)}
                                >
                                    {removePatientIdFromFileKey(fileKey)}
                                </div>
                            ))
                        ) : (
                            <div>Empty</div>
                        )}
                    </div>
                )}
            </RenderRemoteData>
        </>
    );
};
