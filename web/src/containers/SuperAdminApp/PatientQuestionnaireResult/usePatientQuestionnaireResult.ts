import { useLocation } from 'react-router-dom';

import { ExtendedPatient } from 'src/containers/SuperAdminApp/PatientProgressList/usePatientProgressList';
import { objectToDisplay } from 'src/utils/questionnaire';

export const usePatientQuestionnaireResult = () => {
    const location = useLocation<any>();

    const patient = location.state.patient as ExtendedPatient;

    if (!patient.questionnaire) {
        return { patient };
    }

    const questionnaire = objectToDisplay(patient.questionnaire);

    return { patient, questionnaire };
};
