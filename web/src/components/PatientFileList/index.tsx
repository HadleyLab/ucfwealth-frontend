import { Button, Spin } from 'antd';
import { useHistory } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';

import { LeftArrowIcon } from 'src/images/LeftArrowIcon';

import s from './PatientFileList.module.scss';
import { usePatientFileList } from './usePatientFileList';

export const PatientFileList = () => {
    const { fileListRD, downloadFile, removePatientIdFromFileKey, getPatientId } =
        usePatientFileList();

    const history = useHistory();

    const patientId = getPatientId();

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
                            href={`https://uci.beda.software/${patientId}`}
                        >
                            Upload images
                        </Button>
                    </div>
                )}
            </RenderRemoteData>
        </>
    );
};
