import React from 'react';
import { Route, Switch, Router, Redirect } from 'react-router-dom';

import { Token } from 'aidbox-react/src/services/token';

import { getWelcomeString } from 'shared/src/utils/misc';

import { Button } from '../../components/Button';
import { history } from '../../services/history';
import s from './App.module.scss';

export function App() {
    const [appToken] = React.useState<Token | undefined>();

    const renderAnonymousRoutes = () => (
        <Switch>
            <Route path="/signin" exact>
                <div className={s.container}>
                    <header className={s.header}>
                        <p>{getWelcomeString('World')}</p>
                        <Button variant="primary" style={{ marginTop: 15 }}>
                            Sign in
                        </Button>
                    </header>
                </div>
            </Route>
            <Route path="/reset-password" exact render={() => <div>Reset password</div>} />
            <Route path="/set-password/:code" exact render={() => <div>Set password</div>} />
            <Redirect
                to={{
                    pathname: '/signin',
                    state: { referrer: history.location.pathname },
                }}
            />
        </Switch>
    );

    const renderAuthenticatedRoutes = () => {
        const referrer = history?.location?.state?.referrer;

        return (
            <Switch>
                <Route path="/app" render={() => <div>App</div>} />
                <Redirect to={referrer !== '/' ? referrer : '/app'} />
            </Switch>
        );
    };

    const renderRoutes = () => {
        if (appToken) {
            return renderAuthenticatedRoutes();
        }

        return renderAnonymousRoutes();
    };

    return (
        <Router history={history}>
            <Switch>{renderRoutes()}</Switch>
        </Router>
    );
}
