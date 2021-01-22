import React from 'react';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';
import { useService } from 'aidbox-react/src/hooks/service';
import { getFHIRResource } from 'aidbox-react/src/services/fhir';

import {Questionnaire, QuestionnaireResponse} from 'shared/src/contrib/aidbox';

import {QuestionnaireResponseForm} from "src/components/QuestionnaireResponseForm";


export const QuestionnaireForm = () => {

    const [questionnaireRD] = useService<Questionnaire>(() => {
        return getFHIRResource({ resourceType: 'Questionnaire', id: 'covid19' })
    }, []);

    return (
        <div>
            <RenderRemoteData remoteData={questionnaireRD}>
                {(questionnaire) => (
                    <QuestionnaireResponseForm
                        key={questionnaire.id}
                        readOnly
                        questionnaire={questionnaire}
                        resource={{resourceType: 'QuestionnaireResponse'} as QuestionnaireResponse}
                        onSave={async () => {}}
                        onChange={() => {}} />
                )}
            </RenderRemoteData>

        </div>
    )
}
