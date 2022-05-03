import { Spin } from 'antd';
import * as React from 'react';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';
import { useService } from 'aidbox-react/src/hooks/service';
import { getFHIRResources } from 'aidbox-react/src/services/fhir';

import { Patient, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { formatHumanDateTime } from 'src/utils/date';

interface LastActivityProps {
    patient: Patient;
}

export const LastActivity = ({ patient }: LastActivityProps) => {
    const [questionnaireResponseRD] = useService(
        async () =>
            await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
                _ilike: `%${patient.id}%`,
            }),
    );

    return (
        <RenderRemoteData
            remoteData={questionnaireResponseRD}
            renderLoading={() => <Spin />}
            renderFailure={(error) => <div>{JSON.stringify(error)}</div>}
        >
            {(questionnaireResponse) => {
                if (questionnaireResponse.entry && questionnaireResponse.entry?.length > 0) {
                    const lastActivity = formatHumanDateTime(
                        questionnaireResponse.entry?.[0].resource?.meta?.lastUpdated,
                    );
                    return <div>{lastActivity}</div>;
                }
                return <div>{formatHumanDateTime(patient.meta?.lastUpdated)}</div>;
            }}
        </RenderRemoteData>
    );
};
