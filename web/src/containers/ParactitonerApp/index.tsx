import React from 'react';
import { BrowserRouter as Router, Switch, Route, useRouteMatch } from 'react-router-dom';

import { BaseLayout } from 'src/components/BaseLayout';
import { RouteItem } from 'src/utils/route';

export function PractitionerApp() {
    let match = useRouteMatch();
    const routes: RouteItem[] = [
        {
            path: `${match.url}/test`,
            title: 'Test',
        },
    ];

    return (
        <Router>
            <BaseLayout routes={routes}>
                <Switch>
                    <Route path={`${match.url}/test`} exact render={() => <p>Test</p>} />
                    <Route path={'/'} render={() => <p>Page not found</p>} />
                </Switch>
            </BaseLayout>
        </Router>
    );
}
