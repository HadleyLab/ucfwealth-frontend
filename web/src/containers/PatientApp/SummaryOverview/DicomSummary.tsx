import { downloadFile, removePatientIdFromFileKey } from 'src/utils/patientFileList';

interface Props {
    data: any;
}

export const DicomSummary = ({ data }: Props) => {
    return (
        <div>
            {data.dicomFileList.length > 0 ? (
                data.dicomFileList.map((fileKey: string, key: string) => (
                    <div key={key} onClick={() => downloadFile(fileKey)}>
                        {removePatientIdFromFileKey(fileKey)}
                    </div>
                ))
            ) : (
                <div>Empty</div>
            )}
        </div>
    );
};
