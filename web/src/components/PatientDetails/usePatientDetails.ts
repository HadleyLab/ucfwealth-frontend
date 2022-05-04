import { useLocation } from 'react-router-dom';

import { ExtendedPatient } from 'src/containers/SuperAdminApp/PatientListContainer/usePatientList';
import { objectToDisplay } from 'src/utils/questionnaire';

export const usePatientDetails = () => {
    const location = useLocation<any>();

    const patient = location.state.patient as ExtendedPatient;

    if (!patient.questionnaire) {
        return { patient };
    }

    const questionnaire = objectToDisplay(patient.questionnaire);

    return { patient, questionnaire };
};
