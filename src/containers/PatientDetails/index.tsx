import { CarePlan, Patient } from 'fhir/r4b';
import { useMemo } from 'react';
import { useParams, Outlet, Route, Routes } from 'react-router-dom';

import { Spinner } from '@beda.software/emr/components';
import { PatientReloadProvider } from '@beda.software/emr/dist/containers/PatientDetails/Dashboard/contexts';
import { usePatientResource } from '@beda.software/emr/dist/containers/PatientDetails/hooks';
import { PatientDocument } from '@beda.software/emr/dist/containers/PatientDetails/PatientDocument/index';
import { PatientDocumentDetails } from '@beda.software/emr/dist/containers/PatientDetails/PatientDocumentDetails/index';
import { PatientOverview } from '@beda.software/emr/dist/containers/PatientDetails/PatientOverviewDynamic/index';
import { selectCurrentUserRoleResource } from '@beda.software/emr/utils';
import { RenderRemoteData } from '@beda.software/fhir-react';
import { isSuccess } from '@beda.software/remote-data';

import { BasePageContent } from 'src/components/BaseLayout';
import { RouteItem } from 'src/components/BaseLayout/Sidebar/SidebarTop';

import { PatientHeader, PatientHeaderContextProvider } from './PatientHeader';

export interface PatientDetailsEmbeddedPageDefinition extends RouteItem {
    routes: Array<ReturnType<typeof Route>>;
}

export interface PatientDetailsProps {
    embeddedPages?: (patient: Patient, carePlans: CarePlan[]) => PatientDetailsEmbeddedPageDefinition[];
    isDefaultRoutesDisabled?: boolean;
}

export const PatientDetails = (props: PatientDetailsProps) => {
    const params = useParams<{ id: string }>();

    const [patientResponse, manager] = usePatientResource({ id: params.id! });
    const author = selectCurrentUserRoleResource();
    const embeddedPages = useMemo(() => {
        if (isSuccess(patientResponse)) {
            return props.embeddedPages?.(patientResponse.data.patient, patientResponse.data.carePlans);
        }
    }, [patientResponse]);

    return (
        <RenderRemoteData remoteData={patientResponse} renderLoading={Spinner}>
            {({ patient }) => {
                return (
                    <PatientReloadProvider reload={manager.softReloadAsync}>
                        <PatientHeaderContextProvider patient={patient}>
                            <PatientHeader />
                            <BasePageContent>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <>
                                                <Outlet />
                                            </>
                                        }
                                    >
                                        {!props.isDefaultRoutesDisabled && (
                                            <>
                                                <Route path="/" element={<PatientOverview patient={patient} />} />
                                                <Route
                                                    path="/documents/new/:questionnaireId"
                                                    element={<PatientDocument patient={patient} author={author} />}
                                                />
                                                <Route
                                                    path="/documents/:qrId/*"
                                                    element={<PatientDocumentDetails patient={patient} hideControls />}
                                                />
                                            </>
                                        )}
                                        {embeddedPages?.flatMap(({ routes }) => routes)}
                                    </Route>
                                </Routes>
                            </BasePageContent>
                        </PatientHeaderContextProvider>
                    </PatientReloadProvider>
                );
            }}
        </RenderRemoteData>
    );
};
