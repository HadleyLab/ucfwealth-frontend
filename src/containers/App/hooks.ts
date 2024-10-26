import { Consent, Patient } from 'fhir/r4b';

import { getFHIRResources } from '@beda.software/emr/services';
import { extractBundleResources, useService } from '@beda.software/fhir-react';
import { mapSuccess, resolveMap } from '@beda.software/remote-data';

export function usePatientConsent(patient: Patient) {
    const [response] = useService(
        async () =>
            mapSuccess(
                await resolveMap({
                    consentBundle: getFHIRResources<Consent>('Consent', {
                        category: 'npp',
                        patient: `Patient/${patient.id}`,
                    }),
                }),
                ({ consentBundle }) => {
                    const consent = extractBundleResources<Consent>(consentBundle).Consent[0];

                    return {
                        consent,
                    };
                },
            ),
        [patient],
    );

    return { response };
}
