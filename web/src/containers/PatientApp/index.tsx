import React from 'react';
import { BrowserRouter as Router, Switch, Route, useRouteMatch } from 'react-router-dom';

import { BaseLayout } from 'src/components/BaseLayout';
import { MedicalData } from 'src/containers/MedicalData';
import { RouteItem } from 'src/utils/route';

import { QuestionnaireForm } from './QuestionnaireForm/QuestionnaireForm';

interface PatientAppProps {}

export function PatientApp({}: PatientAppProps) {
    let match = useRouteMatch();
    const routes: RouteItem[] = [
        {
            path: `${match.url}/questionnaire`,
            title: 'Questionnaire',
        },
        {
            path: `${match.url}/medical-data`,
            title: 'Medical data',
        },
    ];

    return (
        <Router>
            <BaseLayout routes={routes}>
                <Switch>
                    <Route
                        path={`${match.url}/questionnaire`}
                        exact
                        render={() => <QuestionnaireForm />}
                    />
                    <Route
                        path={`${match.url}/medical-data`}
                        exact
                        render={() => <MedicalData />}
                    />
                    <Route path={'/'} render={() => <p>Page not found</p>} />
                </Switch>
            </BaseLayout>
        </Router>
    );
}
