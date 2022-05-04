import * as React from 'react';
import { SVGProps } from 'react';

import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';
import { useService } from 'aidbox-react/src/hooks/service';
import { getFHIRResources } from 'aidbox-react/src/services/fhir';

import { Patient, QuestionnaireResponse } from 'shared/src/contrib/aidbox';

interface QuestionnairesProps {
    patient: Patient;
}

export const Questionnaires = ({ patient }: QuestionnairesProps) => {
    const [questionnaireResponseRD] = useService(
        async () =>
            await getFHIRResources<QuestionnaireResponse>('QuestionnaireResponse', {
                _ilike: `%${patient.id}%`,
            }),
    );

    return (
        <RenderRemoteData
            remoteData={questionnaireResponseRD}
            renderLoading={() => <div>Loading...</div>}
            renderFailure={(error) => <div>{JSON.stringify(error)}</div>}
        >
            {(questionnaireResponse) => {
                if (questionnaireResponse.entry && questionnaireResponse.entry?.length > 0) {
                    return <SuccessIcon />;
                }
                return <EmptyIcon />;
            }}
        </RenderRemoteData>
    );
};

const SuccessIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg width={14} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M7 .875a6.125 6.125 0 1 0 0 12.25A6.125 6.125 0 0 0 7 .876ZM9.646 5l-2.88 3.992a.435.435 0 0 1-.707 0L4.354 6.629a.11.11 0 0 1 .09-.173h.64c.14 0 .273.067.355.182l.973 1.35 2.15-2.98a.437.437 0 0 1 .353-.182h.642c.089 0 .14.101.089.174Z"
            fill="#52C41A"
        />
    </svg>
);

const EmptyIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg width={14} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M7 .875a6.125 6.125 0 1 0 0 12.25A6.125 6.125 0 0 0 7 .876ZM9.646 5l-2.88 3.992a.435.435 0 0 1-.707 0L4.354 6.629a.11.11 0 0 1 .09-.173h.64c.14 0 .273.067.355.182l.973 1.35 2.15-2.98a.437.437 0 0 1 .353-.182h.642c.089 0 .14.101.089.174Z"
            fill="#000"
            fillOpacity={0.25}
        />
    </svg>
);
