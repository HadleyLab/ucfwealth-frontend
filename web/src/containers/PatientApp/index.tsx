import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';

import { Patient, User } from 'shared/src/contrib/aidbox';

import { BaseLayout } from 'src/components/BaseLayout';
import { fileUploaderUrl } from 'src/config.url';
import { sharedPatientId } from 'src/sharedState';
import { RouteItem } from 'src/utils/route';

import { QuestionnaireFormWrapper } from './QuestionnaireFormWrapper';
import { usePatientApp } from './usePatientApp';

interface PatientAppProps {
    user: User;
}

export function PatientApp({ user }: PatientAppProps) {
    const { patientRD, match, isSuccessQuestionnaire, setIsSuccessQuestionnaire } = usePatientApp({
        user,
    });

    sharedPatientId.setSharedState({ id: user.data.patient?.id || '' });

    const routes: RouteItem[] = [
        {
            url: `https://beda.software/breast-cancer/`,
            title: <span style={titleStyle}>Home</span>,
        },
        {
            path: `${match.url}/questionnaire`,
            title: <span style={titleStyle}>Profile data</span>,
        },
        {
            url: `${fileUploaderUrl}/${user.data.patient?.id}`,
            title: <span style={titleStyle}>Medical data</span>,
        },
        {
            url: `https://community.covidimaging.app/auth/oauth2_basic`, // TODO config COMMUNITY_URL
            title: <span style={titleStyle}>Community</span>,
        },
    ];

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

export const titleStyle = {
    fontWeight: 600,
};
