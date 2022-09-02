import { Button } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';

import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { ShowImage } from 'src/components/ShowImage';
import { LeftArrowIcon } from 'src/images/LeftArrowIcon';
import { downloadFile } from 'src/utils/patientFileList';

import s from './PatientFileList.module.scss';
import { usePatientFileList } from './usePatientFileList';

export const PatientFileList = () => {
    const { fileListRD, patientId } = usePatientFileList();

    const history = useHistory();

    const location = useLocation<any>();

    const pageNumber = location.state.pageNumber;

    return (
        <>
            <div className={s.headerWrapper}>
                <div
                    onClick={() => history.push('/app', { pageNumber: pageNumber ?? 1 })}
                    className={s.leftArrow}
                >
                    <LeftArrowIcon />
                </div>
                <div className={s.header}>Dicom Files</div>
            </div>
            <RenderRemoteData remoteData={fileListRD}>
                {(data) => (
                    <div className={s.fileList}>
                        {data.dicomFileList.length > 0 ? (
                            data.dicomFileList.map((fileName: string, key: string) => (
                                <div>
                                    <div
                                        className={s.fileKey}
                                        key={key}
                                        onClick={() => downloadFile(`${patientId}/${fileName}`)}
                                    >
                                        {fileName}
                                    </div>
                                    <div className={s.showImage}>
                                        <ShowImage fileKey={`${patientId}/${fileName}`} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>Empty</div>
                        )}
                        <Button
                            className={s.uploadImages}
                            type="primary"
                            onClick={() =>
                                history.push(`/patients/${patientId}`, {
                                    pageNumber: pageNumber ?? 1,
                                })
                            }
                        >
                            Upload images
                        </Button>
                    </div>
                )}
            </RenderRemoteData>
        </>
    );
};
