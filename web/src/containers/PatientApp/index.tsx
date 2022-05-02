import React from 'react';
import { BrowserRouter as Router, Switch, Route, useRouteMatch } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';
import { useService } from 'aidbox-react/src/hooks/service';
import { getFHIRResource } from 'aidbox-react/src/services/fhir';

import { Patient, User } from 'shared/src/contrib/aidbox';

import { BaseLayout } from 'src/components/BaseLayout';
import { RouteItem } from 'src/utils/route';

import { QuestionnaireForm } from './QuestionnaireForm/QuestionnaireForm';

interface PatientAppProps {
    user: User;
}

export function PatientApp({ user }: PatientAppProps) {
    let match = useRouteMatch();
    const routes: RouteItem[] = [
        {
            url: `https://beda.software/breast-cancer/`,
            title: 'Home',
        },
        {
            path: `${match.url}/questionnaire`,
            title: 'Profile data',
        },
        {
            url: `https://uci.beda.software/`,
            title: 'Medical data',
        },
        {
            url: `https://community.covidimaging.app/`,
            title: 'Community',
        },
    ];

    const patientRef = user.data.patient;

    if (patientRef === undefined) {
        console.error('patientRef undefined');
    }

    const [patientRD] = useService<Patient>(() => getFHIRResource<Patient>(patientRef!));

    return (
        <RenderRemoteData<Patient> remoteData={patientRD}>
            {(patient) => (
                <Router>
                    <BaseLayout routes={routes}>
                        <Switch>
                            <Route
                                path={`${match.url}/questionnaire`}
                                exact
                                render={() => <QuestionnaireForm patient={patient} />}
                            />
                            <Route path={'/'} render={() => <p>Page not found</p>} />
                        </Switch>
                    </BaseLayout>
                </Router>
            )}
        </RenderRemoteData>
    );
}
