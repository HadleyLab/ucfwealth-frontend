import React from 'react';
import { Field, Form } from 'react-final-form';
import { Route, Switch, Router, Redirect } from 'react-router-dom';

import { isSuccess } from 'aidbox-react/src/libs/remoteData';
import { service } from 'aidbox-react/src/services/service';
import { Token } from 'aidbox-react/src/services/token';

import config from 'shared/src/config';

import { Button } from '../../components/Button';
import { history } from '../../services/history';
import s from './App.module.scss';

interface FormValues {
    email: string;
    password: string;
}

export function App() {
    const storageToken = localStorage.getItem('token');
    const savedToken = storageToken ? JSON.parse(storageToken) : undefined;
    const [appToken, setAppToken] = React.useState<Token | undefined>(savedToken);

    const onSignUpFormSubmit = async (values: FormValues) => {
        const response = await service({
            url: config.baseURL + '/auth/token',
            method: 'POST',
            data: {
                username: values.email,
                password: values.password,
                grant_type: 'password',
                client_id: 'SPA',
                client_secret: '123456',
            },
        });

        if (isSuccess(response)) {
            localStorage.setItem('token', JSON.stringify(response.data));
            setAppToken(response.data);
        }
    };

    const renderAnonymousRoutes = () => (
        <Switch>
            <Route path="/signin" exact>
                <div className={s.container}>
                    <Form onSubmit={onSignUpFormSubmit}>
                        {({ handleSubmit }) => (
                            <div>
                                <div>
                                    <span>E-Mail</span>
                                    <Field name="email">
                                        {(fieldProps) => (
                                            <input
                                                type="email"
                                                autoCapitalize="none"
                                                {...fieldProps.input}
                                            />
                                        )}
                                    </Field>
                                </div>
                                <div>
                                    <span>Password</span>
                                    <Field name="password">
                                        {(fieldProps) => (
                                            <input type="password" {...fieldProps.input} />
                                        )}
                                    </Field>
                                </div>
                                <Button onClick={handleSubmit}>Sign in</Button>
                            </div>
                        )}
                    </Form>
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
