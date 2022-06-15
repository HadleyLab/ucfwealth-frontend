import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';

import { Patient, User } from 'shared/src/contrib/aidbox';

import { BaseLayout } from 'src/components/BaseLayout';

import { QuestionnaireFormWrapper } from './QuestionnaireFormWrapper';
import { usePatientApp } from './usePatientApp';

interface PatientAppProps {
    user: User;
}

export function PatientApp({ user }: PatientAppProps) {
    const { routes, patientRD, match, isSuccessQuestionnaire, setIsSuccessQuestionnaire } =
        usePatientApp({ user });

    return (
        <RenderRemoteData<Patient> remoteData={patientRD}>
            {(patient) => (
                <Router>
                    <BaseLayout
                        routes={routes}
                        setIsSuccessQuestionnaire={setIsSuccessQuestionnaire}
                    >
                        <Switch>
                            <Route
                                path={`${match.url}/questionnaire`}
                                exact
                                render={() => (
                                    <QuestionnaireFormWrapper
                                        isSuccessQuestionnaire={isSuccessQuestionnaire}
                                        setIsSuccessQuestionnaire={setIsSuccessQuestionnaire}
                                        patient={patient}
                                    />
                                )}
                            />
                            <Route path={'/'} render={() => <p>Page not found</p>} />
                        </Switch>
                    </BaseLayout>
                </Router>
            )}
        </RenderRemoteData>
    );
}
