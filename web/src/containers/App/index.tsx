import React, {useEffect, useState} from 'react';
import {Route, Switch, Router, Redirect} from 'react-router-dom';

import {isFailure, notAsked, RemoteData} from "aidbox-react/lib/libs/remoteData";
import {resetInstanceToken, setInstanceBaseURL, setInstanceToken} from "aidbox-react/lib/services/instance";
import {isSuccess} from 'aidbox-react/src/libs/remoteData';
import {Token} from 'aidbox-react/src/services/token';

import {User} from "shared/src/contrib/aidbox";

import {RoleSwitch} from "src/components/RoleSwitch";
import {Login} from "src/containers/Login";
import {SuperAdminApp} from "src/containers/SuperAdminApp";
import {UnprivilegedApp} from "src/containers/UnprivilegedApp";
import {getUserInfo} from "src/services/auth";
import {baseURL} from "src/services/constants";
import {getUserRole, UserRole} from "src/services/role";
import {removeToken, retrieveToken, saveToken} from "src/services/token";

import {history} from '../../services/history';
import {SessionContext} from '../SessionContext';


(function init() {
    setInstanceBaseURL(baseURL);
    const globalToken = retrieveToken();

    if (globalToken) {
        setInstanceToken(globalToken);
    }
})();

function useApp() {
    const [appToken, setAppToken] = useState<Token | undefined>(retrieveToken());

    const setToken = (token: Token) => {
        setInstanceToken(token);
        saveToken(token);
        setAppToken(token);
    };

    const resetToken = () => {
        resetInstanceToken();
        removeToken();
        setAppToken(undefined);
    };

    const [userRD, setUserRD] = useState<RemoteData<User>>(notAsked);

    useEffect(() => {
        (async () => {
            const userRemoteData = await getUserInfo();
            setUserRD(userRemoteData);
        })();
    }, [appToken]);

    return {appToken, setToken, userRD, logout: resetToken};
}

export function App() {
    const {appToken, setToken, userRD, logout} = useApp();


    function renderAnonymousRoutes() {
        return (
            <Switch>
                {/*<Route path="/signup" exact render={(props) => <Signup {...props} />} />*/}
                <Route path="/login" exact>
                    <Login setToken={setToken}/>
                </Route>
                {/*<Route path="/reset-password" exact render={(props) => <ResetPassword {...props} />} />*/}
                {/*<Route path="/set-password/:code" exact render={(props) => <SetPasswordWrapper {...props} />} />*/}
                <Redirect
                    to={{
                        pathname: '/login',
                        state: {referrer: history.location.pathname},
                    }}
                />
            </Switch>
        );
    }

    const renderAuthenticatedRoutes = () => {
        const referrer = history?.location?.state?.referrer;
        if (isSuccess(userRD)) {
            const user = userRD.data;
            return (
                <Switch>
                    <Route path="/app">
                        <SessionContext.Provider value={{user, role: getUserRole(user), logout}}>
                            <RoleSwitch>
                                {{
                                    [UserRole.SuperAdminRole]: () => <SuperAdminApp/>,
                                    // [UserRole.PatientRole]: () => <PatientApp />,
                                    // [UserRole.PractitionerRole]: () => <PractitionerApp />,
                                    default: () => <UnprivilegedApp/>,
                                }}
                            </RoleSwitch>
                        </SessionContext.Provider>
                    </Route>
                    <Redirect to={referrer !== '/' ? referrer : '/app'}/>
                </Switch>
            );
        }
        if (isFailure(userRD)) {
            return (
                <div>
                    Something went wrong while loading your user data. Refresh the page or{' '}
                    <a onClick={logout}>logout</a> and login again.
                </div>
            );
        }

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
}
