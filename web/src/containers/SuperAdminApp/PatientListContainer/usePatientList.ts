import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure } from 'aidbox-react/src/libs/remoteData';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/src/services/fhir';
import { mapSuccess } from 'aidbox-react/src/services/service';

import { Patient } from 'shared/src/contrib/aidbox';

export const usePatientList = () => {
    const [patientListRD] = useService(async () => {
        const response = await getFHIRResources<Patient>('Patient', {
            _sort: '-lastUpdated',
        });

        if (isFailure(response)) {
            console.error({ message: JSON.stringify(response.error) });
        }

        return mapSuccess(response, (bundle) => extractBundleResources(bundle).Patient);
    }, []);
    return { patientListRD };
};
