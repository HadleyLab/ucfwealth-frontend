import './styles.css';
import { useLocation } from 'react-router-dom';

import { useService } from 'aidbox-react/src/hooks/service';
import { getFHIRResources } from 'aidbox-react/src/services/fhir';

import { QuestionnaireResponse } from 'shared/src/contrib/aidbox';

export const usePatientDetails = () => {
    const location = useLocation<any>();

    const patient = location.state.patient;

    const searchText = patient.id;

    const [questionnaireResponseRD] = useService(
        async () =>
            await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
                _ilike: `%${searchText}%`,
            }),
    );

    return { questionnaireResponseRD, patient };
};
