import { Button } from 'antd';
import { useHistory } from 'react-router-dom';

import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { FILE_UPLOADER_FRONTEND_URL } from 'src/config.url';
import { LeftArrowIcon } from 'src/images/LeftArrowIcon';
import { downloadFile, removePatientIdFromFileKey } from 'src/utils/patientFileList';

import s from './PatientFileList.module.scss';
import { usePatientFileList } from './usePatientFileList';

export const PatientFileList = () => {
    const { fileListRD, patientId } = usePatientFileList();

    const history = useHistory();

    return (
        <>
            <div className={s.headerWrapper}>
                <div onClick={() => history.goBack()} className={s.leftArrow}>
                    <LeftArrowIcon />
                </div>
                <div className={s.header}>Dicom Files</div>
            </div>
            <RenderRemoteData remoteData={fileListRD}>
                {(data) => (
                    <div className={s.fileList}>
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
                        <Button
                            className={s.uploadImages}
                            type="primary"
                            href={`${FILE_UPLOADER_FRONTEND_URL}/${patientId}`}
                        >
                            Upload images
                        </Button>
                    </div>
                )}
            </RenderRemoteData>
        </>
    );
};
