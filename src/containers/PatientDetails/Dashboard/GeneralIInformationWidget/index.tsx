import type { ContainerProps } from '@beda.software/emr/dist/components/Dashboard/types';
import { GeneralInformationDashboard } from '@beda.software/emr/dist/containers/PatientDetails/PatientOverviewDynamic/components/GeneralInformationDashboard/index';

import { useGeneralInformationDashboard } from './hooks';

export function GeneralIInformationWidget({ patient }: ContainerProps) {
    const { patientDetails } = useGeneralInformationDashboard(patient);

    return <GeneralInformationDashboard patientDetails={patientDetails} patient={patient} />;
}
