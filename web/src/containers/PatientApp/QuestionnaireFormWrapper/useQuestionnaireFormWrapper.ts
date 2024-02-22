import { message } from 'antd';
import { useCallback, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure, isSuccess } from 'aidbox-react/src/libs/remoteData';
import {
    extractBundleResources,
    getFHIRResources,
    saveFHIRResource,
} from 'aidbox-react/src/services/fhir';
import { mapSuccess, sequenceMap, service } from 'aidbox-react/src/services/service';

import { Patient, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { DicomContent } from 'src/containers/FileUploader/hooks/useFileUploader';
import { sharedPatientId } from 'src/sharedState';

interface Props {
    patient: Patient;
}

export interface UploadImageStep {
    uploadImageStep?: boolean;
}

interface StepAccess {
    completedQuestionnaires: number;
    uploadedFiles: number;
}

interface StepInfo {
    currentStep: number;
    firstStepLoad: boolean;
    stepAccess: StepAccess;
}

export interface QuestionnaireStepManager {
    sessionId: string;
    getDefaultStep: (
        questionnaireResponseList: QuestionnaireResponse[],
        dicomContentList: string[],
    ) => 0 | 1 | 2;
    stepInfo: StepInfo;
    setStepInfo: (stepInfo: StepInfo) => void;
    onContinue: () => Promise<void>;
    uploadImageStep?: boolean;
}

export const useQuestionnaireFormWrapper = ({ patient }: Props) => {
    const [questionnaireSelected, setQuestionnaireSelected] = useState('');

    const sessionId = sharedPatientId.getSharedState().id;

    const [stepInfo, setStepInfo] = useState({
        currentStep: 0,
        firstStepLoad: true,
        stepAccess: {
            completedQuestionnaires: 0,
            uploadedFiles: 0,
        },
    });

    const location = useLocation<UploadImageStep>();
    const history = useHistory();
    const { uploadImageStep } = location.state || false;

    const [patientSettingsRD] = useService(async () => {
        const response = await getFHIRResources('PatientSettings', {
            patient: patient.id,
        });

        if (isFailure(response)) {
            console.log(response.status, response.error);
            return response;
        }

        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).PatientSettings[0] as any;
        });
    }, []);

    const [questionnaireResponseListRD] = useService(async () => {
        const response = await service({
            method: 'GET',
            url: `QuestionnaireResponse?_ilike=${patient && patient.id}`,
        });

        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).QuestionnaireResponse as any;
        });
    }, []);

    const [dicomContentListRD] = useService(async () => {
        const response = await service<DicomContent>({
            method: 'GET',
            url: '/api/get-data',
            params: { sessionId },
        });

        if (isFailure(response)) {
            console.log(response.status, response.error);
            return response;
        }

        return mapSuccess(response, (data) => {
            return data.contents.contents;
        });
    }, []);

    const settingsMapRD = sequenceMap({
        patientSettings: patientSettingsRD,
        questionnaireResponseList: questionnaireResponseListRD,
        dicomContentList: dicomContentListRD,
    });

    const questionnaireSelect = async (questionnaireId: string) => {
        const resource = {
            id: patient.id,
            patient: { id: patient.id, resourceType: 'Patient' },
            questionnaire: {
                id: questionnaireId,
                resourceType: 'Questionnaire',
            },
            resourceType: 'PatientSettings',
        };
        const response = await saveFHIRResource(resource);
        if (isFailure(response)) {
            message.error('Questionnaire does not exist');
            return;
        }
        if (isSuccess(response)) setQuestionnaireSelected(questionnaireId);
    };

    const onContinue = useCallback(async () => {
        if (uploadImageStep) {
            history.push('/app/summary-overview');
            return;
        }

        setStepInfo((prevStepInfo) => {
            return {
                ...prevStepInfo,
                stepAccess: {
                    ...prevStepInfo.stepAccess,
                    uploadedFiles: prevStepInfo.stepAccess.uploadedFiles + 1,
                },
            };
        });

        if (typeof stepInfo.currentStep === 'number') {
            setStepInfo((prevStepInfo) => {
                return {
                    ...prevStepInfo,
                    currentStep: prevStepInfo.currentStep + 1,
                };
            });
        }
    }, [stepInfo, setStepInfo]);

    const questionnaireStepManager: QuestionnaireStepManager = {
        sessionId,
        getDefaultStep: (
            questionnaireResponseList: QuestionnaireResponse[],
            dicomContentList: string[],
        ) => {
            if (uploadImageStep) {
                return 1;
            }
            if (questionnaireResponseList.length >= 1 && dicomContentList.length > 0) {
                return 2;
            }
            if (questionnaireResponseList.length >= 1) {
                return 1;
            }
            return 0;
        },
        stepInfo,
        setStepInfo,
        uploadImageStep,
        onContinue,
    };

    return {
        settingsMapRD,
        questionnaireSelect,
        questionnaireSelected,
        setQuestionnaireSelected,
        questionnaireStepManager,
    };
};
