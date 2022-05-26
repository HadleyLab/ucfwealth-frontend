import React from 'react';
import { BrowserRouter as Router, Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

import { BaseLayout } from 'src/components/BaseLayout';
import { PatientFileList } from 'src/components/PatientFileList';
import { PatientQuestionnaireResult } from 'src/components/PatientQuestionnaireResult';
import { PatientData } from 'src/containers/SuperAdminApp/PatientData';
import { PatientList } from 'src/containers/SuperAdminApp/PatientList';
import { RouteItem } from 'src/utils/route';

import { PatientProgressList } from './PatientProgressList';

interface SuperAdminAppProps {}

export function SuperAdminApp({}: SuperAdminAppProps) {
    let match = useRouteMatch();

    const routes: RouteItem[] = [
        {
            path: `${match.url}`,
            title: 'Progress',
        },
        {
            path: `${match.url}/patients`,
            title: 'Patient list',
        },
    ];

    return (
        <Router>
            <BaseLayout routes={routes}>
                <Switch>
                    <Route
                        path="/patients/:id"
                        render={() => <PatientQuestionnaireResult />}
                        exact
                    />
                    <Route path="/patients/:id/files" render={() => <PatientFileList />} exact />
                    <Route path="/patients/:id/data" render={() => <PatientData />} exact />
                    <Route path={`${match.url}/`} render={() => <PatientProgressList />} exact />
                    <Route path={`${match.url}/patients/`} render={() => <PatientList />} exact />
                    <Route path={'/'} render={() => <p>Page not found</p>} />
                </Switch>
                <Redirect to={`${match.url}`} />
            </BaseLayout>
        </Router>
    );
}
