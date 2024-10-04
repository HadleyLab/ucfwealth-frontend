import type { Dashboard, DashboardInstance } from '@beda.software/emr/dist/components/Dashboard/types';
import { GeneralInformationDashboardContainer } from '@beda.software/emr/dist/containers/PatientDetails/PatientOverviewDynamic/containers/GeneralIInformationDashboardContainer/index';

import { RequiredFormsWidget } from './RequiredFormsWidget';

export const patientDashboardConfig: DashboardInstance = {
    top: [
        {
            widget: GeneralInformationDashboardContainer,
        },
    ],
    left: [
        {
            widget: RequiredFormsWidget,
        },
    ],
    right: [],
    bottom: [],
};

export const dashboard: Dashboard = {
    default: patientDashboardConfig,
    // [Role.Admin]: {},
    // [Role.Practitioner]: {},
};
