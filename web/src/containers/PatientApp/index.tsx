import React from 'react';
import { BrowserRouter as Router, Switch, Route, useRouteMatch } from 'react-router-dom';

import { BaseLayout } from 'src/components/BaseLayout';
import { RouteItem } from 'src/utils/route';

interface PatientAppProps {}

export function PatientApp({}: PatientAppProps) {
    let match = useRouteMatch();
    const routes: RouteItem[] = [
        {
            path: `${match.url}/questionnaire`,
            title: 'Questionnaire',
        },
    ];

    return (
        <Router>
            <BaseLayout routes={routes}>
                <Switch>
                    <Route
                        path={`${match.url}/questionnaire`}
                        exact
                        render={() => <p>Questionnaire</p>}
                    />
                    <Route path={'/'} render={() => <p>Page not found</p>} />
                </Switch>
            </BaseLayout>
        </Router>
    );
}
