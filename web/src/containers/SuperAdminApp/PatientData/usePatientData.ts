import { useLocation } from 'react-router-dom';

import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure } from 'aidbox-react/src/libs/remoteData';
import {
    extractBundleResources,
    getFHIRResource,
    getFHIRResources,
} from 'aidbox-react/src/services/fhir';
import { mapSuccess, sequenceMap } from 'aidbox-react/src/services/service';

import {
    Condition,
    DiagnosticReport,
    ImagingStudy,
    Observation,
    Patient,
} from 'shared/src/contrib/aidbox';

export const usePatientData = () => {
    const location = useLocation();

    const patientId = location.pathname.split('/')[2];

    const defaultSearchParams = {
        _sort: '-lastUpdated',
        _count: 300,
        _ilike: patientId,
    };

    const [patientResourceRD] = useService(async () => {
        const response = await getFHIRResource<Patient>({
            resourceType: 'Patient',
            id: patientId,
        });

        if (isFailure(response)) {
            console.log(response.error);
        }

        return response;
    }, []);

    const [observationListRD] = useService(async () => {
        const response = await getFHIRResources<Observation>('Observation', defaultSearchParams);

        if (isFailure(response)) {
            console.log(response.error);
        }

        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).Observation;
        });
    }, []);

    const [diagnosticReportListRD] = useService(async () => {
        const response = await getFHIRResources<DiagnosticReport>(
            'DiagnosticReport',
            defaultSearchParams,
        );

        if (isFailure(response)) {
            console.log(response.error);
        }

        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).DiagnosticReport;
        });
    }, []);

    const [conditionListRD] = useService(async () => {
        const response = await getFHIRResources<Condition>('Condition', defaultSearchParams);

        if (isFailure(response)) {
            console.log(response.error);
        }

        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).Condition;
        });
    }, []);

    const [imagingStudyListRD] = useService(async () => {
        const response = await getFHIRResources<ImagingStudy>('ImagingStudy', defaultSearchParams);

        if (isFailure(response)) {
            console.log(response.error);
        }

        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).ImagingStudy;
        });
    }, []);

    const patientInfoRD = sequenceMap({
        patientResource: patientResourceRD,
        observationList: observationListRD,
        diagnosticReportList: diagnosticReportListRD,
        conditionList: conditionListRD,
        imagingStudy: imagingStudyListRD,
    });

    return {
        patientResourceRD,
        patientInfoRD,
    };
};
