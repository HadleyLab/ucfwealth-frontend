import { BrowserRouter as Router, Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

import { BaseLayout } from 'src/components/BaseLayout';
import { PatientData } from 'src/containers/SuperAdminApp/PatientData';
import { PatientFileList } from 'src/containers/SuperAdminApp/PatientFileList';
import { PatientList } from 'src/containers/SuperAdminApp/PatientList';
import { PatientQuestionnaireResult } from 'src/containers/SuperAdminApp/PatientQuestionnaireResult';
import { RouteItem } from 'src/utils/route';

import { titleStyle } from '../PatientApp';
import { PatientProgressList } from './PatientProgressList';

export function SuperAdminApp() {
    let match = useRouteMatch();

    const routes: RouteItem[] = [
        {
            path: `${match.url}`,
            title: <span style={titleStyle}>Progress</span>,
        },
        {
            path: `${match.url}/patients`,
            title: <span style={titleStyle}>Patient list</span>,
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
