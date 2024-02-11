import { useHistory, useLocation } from 'react-router-dom';

import { RenderRemoteData } from 'src/components/RenderRemoteData';
import { ShowImage } from 'src/components/ShowImage';
import { FileUploader } from 'src/containers/FileUploader';
import { LeftArrowIcon } from 'src/images/LeftArrowIcon';
import { sharedPatientId } from 'src/sharedState';
import { downloadFile } from 'src/utils/patientFileList';

import s from './PatientFileList.module.scss';
import { usePatientFileList } from './usePatientFileList';

export const PatientFileList = () => {
    const { fileListRD, patientId, setFileListCoordinator } = usePatientFileList();

    const history = useHistory();

    const location = useLocation<any>();

    const pageNumber = location.state.pageNumber;

    sharedPatientId.setSharedState({ id: patientId });

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
            <div className={s.fileUploader}>
                <FileUploader
                    showFileList={false}
                    setFileListCoordinator={setFileListCoordinator}
                />
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
                                        onClick={() => downloadFile(`${fileName}`)}
                                    >
                                        {fileName}
                                    </div>
                                    <div className={s.showImage}>
                                        <ShowImage fileKey={`${fileName}`} />
                                    </div>
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
