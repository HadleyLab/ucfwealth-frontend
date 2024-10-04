import type { Dashboard, DashboardInstance } from '@beda.software/emr/dist/components/Dashboard/types';

import { GeneralIInformationWidget } from './GeneralIInformationWidget';
import { RequiredFormsWidget } from './RequiredFormsWidget';

export const patientDashboardConfig: DashboardInstance = {
    top: [
        {
            widget: GeneralIInformationWidget,
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
