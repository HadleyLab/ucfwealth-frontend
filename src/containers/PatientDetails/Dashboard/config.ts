import type { Dashboard, DashboardInstance } from '@beda.software/emr/dist/components/Dashboard/types';

import { ExplanatoryTextWidget } from './ExplanatoryTextWidget';
import { GeneralIInformationWidget } from './GeneralIInformationWidget';
import { MedicalImagesAuthorizationWidget } from './MedicalImagesAuthorizationWidget';
import { RequiredFormsWidget } from './RequiredFormsWidget';

export const patientDashboardConfig: DashboardInstance = {
    top: [
        {
            widget: GeneralIInformationWidget,
        },
        {
            widget: ExplanatoryTextWidget,
        },
    ],
    left: [
        {
            widget: RequiredFormsWidget,
        },
    ],
    right: [
        {
            widget: MedicalImagesAuthorizationWidget,
        },
    ],
    bottom: [],
};

export const dashboard: Dashboard = {
    default: patientDashboardConfig,
    // [Role.Admin]: {},
    // [Role.Practitioner]: {},
};
