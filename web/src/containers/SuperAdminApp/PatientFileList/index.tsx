import { Button, Spin } from 'antd';
import { useHistory } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';

import { fileUploaderUrl } from 'src/config.url';
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
            <RenderRemoteData remoteData={fileListRD} renderLoading={() => <Spin />}>
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
                            href={`${fileUploaderUrl}/${patientId}`}
                        >
                            Upload images
                        </Button>
                    </div>
                )}
            </RenderRemoteData>
        </>
    );
};
