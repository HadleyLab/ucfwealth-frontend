import queryString from 'query-string';
import { useEffect, useRef } from 'react';
import { Route, BrowserRouter, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { success } from 'aidbox-react/lib/libs/remoteData';

import { User } from '@beda.software/aidbox-types';
import { AnonymousLayout, BaseLayout, Spinner } from '@beda.software/emr/components';
import {
    EncounterList,
    HealthcareServiceList,
    InvoiceDetails,
    InvoiceList,
    MedicationManagement,
    NotificationPage,
    OrganizationScheduling,
    PatientDetails,
    PatientList,
    PatientQuestionnaire,
    PractitionerDetails,
    PractitionerList,
    Prescriptions,
    PublicAppointment,
    QuestionnaireBuilder,
    QuestionnaireList,
    VideoCall,
} from '@beda.software/emr/containers';
import { restoreUserSession } from '@beda.software/emr/dist/containers/App/utils';
import { DocumentPrint } from '@beda.software/emr/dist/containers/PatientDetails/DocumentPrint/index';
import { getToken, parseOAuthState, setToken } from '@beda.software/emr/services';
import { sharedAuthorizedPatient } from '@beda.software/emr/sharedState';
import { matchCurrentUserRole, Role } from '@beda.software/emr/utils';

import { SetPassword } from '../SetPassword';
import { SignIn } from '../SignIn';
import { SignUp } from '../SignUp';

export function App() {
    const [userResponse] = useService(async () => {
        const appToken = getToken();
        return appToken ? restoreUserSession(appToken) : success(null);
    });

    const renderRoutes = (user: User | null) => {
        if (user) {
            return matchCurrentUserRole({
                [Role.Admin]: () => <AuthenticatedAdminUserApp />,
                [Role.Patient]: () => <AuthenticatedPatientUserApp />,
                [Role.Practitioner]: () => <AuthenticatedPractitionerUserApp />,
                [Role.Receptionist]: () => <AuthenticatedReceptionistUserApp />,
            });
        }

        return <AnonymousUserApp />;
    };

    return (
        <div data-testid="app-container">
            <RenderRemoteData remoteData={userResponse} renderLoading={Spinner}>
                {(user) => <BrowserRouter>{renderRoutes(user)}</BrowserRouter>}
            </RenderRemoteData>
        </div>
    );
}

export function Auth() {
    const location = useLocation();

    useEffect(() => {
        const queryParams = queryString.parse(location.hash);

        if (queryParams.access_token) {
            setToken(queryParams.access_token as string);
            const state = parseOAuthState(queryParams.state as string | undefined);

            window.location.href = state.nextUrl ?? '/';
        }
    }, [location.hash]);

    return null;
}

function AnonymousUserApp() {
    const location = useLocation();
    const originPathRef = useRef(location.pathname);
    const navigate = useNavigate();

    return (
        <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/signin" element={<SignIn originPathName={originPathRef.current} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-password/:code" element={<SetPassword />} />
            <Route
                path="/appointment/book"
                element={
                    <AnonymousLayout>
                        <PublicAppointment />
                    </AnonymousLayout>
                }
            />
            <Route
                path="/questionnaire"
                element={
                    <AnonymousLayout>
                        <PatientQuestionnaire onSuccess={() => navigate('thanks')} />
                    </AnonymousLayout>
                }
            />
            <Route
                path="*"
                element={
                    <>
                        <Navigate to="/signin" replace={true} />
                    </>
                }
            />
            <Route
                path="/thanks"
                element={
                    <NotificationPage
                        title="Thank you!"
                        text="Thank you for filling out the questionnaire. Now you can close this page."
                    />
                }
            />
        </Routes>
    );
}

function AuthenticatedAdminUserApp() {
    return (
        <BaseLayout>
            <Routes>
                {/* TODO: in the current implementation admin will get all patients via /patients, but it's wrong */}
                <Route path="/patients" element={<PatientList />} />
                <Route path="/encounters" element={<EncounterList />} />
                <Route path="/invoices" element={<InvoiceList />} />
                <Route path="/invoices/:id" element={<InvoiceDetails />} />
                <Route path="/appointment/book" element={<PublicAppointment />} />
                <Route path="/questionnaire" element={<PatientQuestionnaire />} />
                <Route path="/patients/:id/*" element={<PatientDetails />} />
                <Route path="/documents/:id/edit" element={<div>documents/:id/edit</div>} />
                <Route path="/encounters/:encounterId/video" element={<VideoCall />} />
                <Route path="/practitioners" element={<PractitionerList />} />
                <Route path="/practitioners/:id/*" element={<PractitionerDetails />} />
                <Route path="/questionnaires" element={<QuestionnaireList />} />
                <Route path="/questionnaires/builder" element={<QuestionnaireBuilder />} />
                <Route path="/questionnaires/:id/edit" element={<QuestionnaireBuilder />} />
                <Route path="/questionnaires/:id" element={<div>questionnaires/:id</div>} />
                <Route path="/healthcare-services" element={<HealthcareServiceList />} />
                <Route path="*" element={<Navigate to="/encounters" />} />
            </Routes>
        </BaseLayout>
    );
}

function AuthenticatedPractitionerUserApp() {
    return (
        <Routes>
            <Route path={`/print-patient-document/:id/:qrId`} element={<DocumentPrint />} />
            <Route
                path="*"
                element={
                    <BaseLayout>
                        <Routes>
                            <Route path="/patients" element={<PatientList />} />
                            <Route path="/encounters" element={<EncounterList />} />
                            <Route path="/appointment/book" element={<PublicAppointment />} />
                            <Route path="/questionnaire" element={<PatientQuestionnaire />} />
                            <Route path="/patients/:id/*" element={<PatientDetails />} />
                            <Route path="/documents/:id/edit" element={<div>documents/:id/edit</div>} />
                            <Route path="/encounters/:encounterId/video" element={<VideoCall />} />
                            <Route path="/practitioners" element={<PractitionerList />} />
                            <Route path="/practitioners/:id/*" element={<PractitionerDetails />} />
                            <Route path="/questionnaires" element={<QuestionnaireList />} />
                            <Route path="/questionnaires/builder" element={<QuestionnaireBuilder />} />
                            <Route path="/questionnaires/:id/edit" element={<QuestionnaireBuilder />} />
                            <Route path="/questionnaires/:id" element={<div>questionnaires/:id</div>} />
                            <Route path="*" element={<Navigate to="/encounters" />} />
                        </Routes>
                    </BaseLayout>
                }
            />
        </Routes>
    );
}

function AuthenticatedReceptionistUserApp() {
    return (
        <Routes>
            <Route path={`/print-patient-document/:id/:qrId`} element={<DocumentPrint />} />
            <Route
                path="*"
                element={
                    <BaseLayout>
                        <Routes>
                            <Route path="/scheduling" element={<OrganizationScheduling />} />
                            <Route path="/invoices" element={<InvoiceList />} />
                            <Route path="/invoices/:id" element={<InvoiceDetails />} />
                            <Route path="/medications" element={<MedicationManagement />} />
                            <Route path="/prescriptions" element={<Prescriptions />} />
                            <Route path="*" element={<Navigate to="/scheduling" />} />
                        </Routes>
                    </BaseLayout>
                }
            />
        </Routes>
    );
}

function AuthenticatedPatientUserApp() {
    const [patient] = sharedAuthorizedPatient.useSharedState();

    return (
        <BaseLayout>
            <Routes>
                <Route path="/invoices" element={<InvoiceList />} />
                <Route path="/invoices/:id" element={<InvoiceDetails />} />
                <Route path={`/patients/:id/*`} element={<PatientDetails />} />
                <Route path="*" element={<Navigate to={`/patients/${patient!.id}`} />} />
            </Routes>
        </BaseLayout>
    );
}
