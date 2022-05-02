import React from 'react';
import { BrowserRouter as Router, Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

import { BaseLayout } from 'src/components/BaseLayout';
import { RouteItem } from 'src/utils/route';

import { PatientListContainer } from './PatientListContainer';

interface SuperAdminAppProps {}

export function SuperAdminApp({}: SuperAdminAppProps) {
    let match = useRouteMatch();
    const routes: RouteItem[] = [
        {
            path: `${match.url}/`,
            title: 'Patients',
        },
    ];

    return (
        <Router>
            <BaseLayout routes={routes}>
                <Switch>
                    <Route path={`${match.url}/`} exact render={() => <PatientListContainer />} />
                    <Route path={'/'} render={() => <p>Page not found</p>} />
                </Switch>
                <Redirect to={`${match.url}/`} />
            </BaseLayout>
        </Router>
    );
}
