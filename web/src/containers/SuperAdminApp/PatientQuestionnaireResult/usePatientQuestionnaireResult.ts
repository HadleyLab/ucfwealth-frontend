import { useLocation } from 'react-router-dom';

import { ExtendedPatient } from 'src/containers/SuperAdminApp/PatientProgressList/usePatientProgressList';
import { objectToDisplay } from 'src/utils/questionnaire';

export const usePatientQuestionnaireResult = () => {
    const location = useLocation<any>();

    const patient = location.state.patient as ExtendedPatient;

    if (!patient.questionnaireList) {
        return { patient };
    }

    const questionnaire = objectToDisplay(patient.questionnaireList);

    return { patient, questionnaire };
};
