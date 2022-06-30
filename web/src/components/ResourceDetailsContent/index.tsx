import {
    AidboxResource,
    Condition,
    DiagnosticReport,
    ImagingStudy,
    Observation,
} from 'shared/src/contrib/aidbox';

import { ObservationDetails } from 'src/components/ResourceDetailsContent/ObservationDetails';

import { ConditionDetails } from './ConditionDetails';
import { DiagnosticReports } from './DiagnosticReports';
import { ImagingStudyDetails } from './ImagingStudyDetails';

export const ResourceDetailsContent = ({ resource }: { resource: AidboxResource }) => {
    if (resource.resourceType === 'Observation') {
        return <ObservationDetails observation={resource as Observation} />;
    }

    if (resource.resourceType === 'DiagnosticReport') {
        return <DiagnosticReports diagnosticReport={resource as DiagnosticReport} />;
    }

    if (resource.resourceType === 'Condition') {
        return <ConditionDetails condition={resource as Condition} />;
    }

    if (resource.resourceType === 'ImagingStudy') {
        return <ImagingStudyDetails imagingStudy={resource as ImagingStudy} />;
    }

    return <div>{JSON.stringify(resource)}</div>;
};
