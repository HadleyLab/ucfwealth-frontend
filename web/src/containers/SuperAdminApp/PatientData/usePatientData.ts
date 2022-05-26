import { useLocation } from 'react-router-dom';

import { useService } from 'aidbox-react/src/hooks/service';
import { isFailure } from 'aidbox-react/src/libs/remoteData';
import {
    extractBundleResources,
    getFHIRResource,
    getFHIRResources,
} from 'aidbox-react/src/services/fhir';
import { mapSuccess } from 'aidbox-react/src/services/service';

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
        const response = await getFHIRResources<Observation>('Observation', {
            _sort: '-lastUpdated',
            _include: `subject:uri=urnuuid${patientId}`,
        });

        if (isFailure(response)) {
            console.log(response.error);
        }

        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).Observation;
        });
    }, []);

    const [diagnosticReportListRD] = useService(async () => {
        const response = await getFHIRResources<DiagnosticReport>('DiagnosticReport', {
            _sort: '-lastUpdated',
            _include: `subject:uri=urnuuid${patientId}`,
        });

        if (isFailure(response)) {
            console.log(response.error);
        }

        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).DiagnosticReport;
        });
    }, []);

    const [conditionListRD] = useService(async () => {
        const response = await getFHIRResources<Condition>('Condition', {
            _sort: '-lastUpdated',
            _include: `subject:uri=urnuuid${patientId}`,
        });

        if (isFailure(response)) {
            console.log(response.error);
        }

        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).Condition;
        });
    }, []);

    const [imagingStudyListRD] = useService(async () => {
        const response = await getFHIRResources<ImagingStudy>('ImagingStudy', {
            _sort: '-lastUpdated',
            _include: `subject:uri=urnuuid${patientId}`,
        });

        if (isFailure(response)) {
            console.log(response.error);
        }

        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).ImagingStudy;
        });
    }, []);

    return {
        patientResourceRD,
        observationListRD,
        diagnosticReportListRD,
        conditionListRD,
        imagingStudyListRD,
    };
};
