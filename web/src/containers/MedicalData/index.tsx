import React from 'react';

import { useService } from 'aidbox-react/src/hooks/service';
import { service } from 'aidbox-react/src/services/service';

import { Bundle } from 'shared/contrib/aidbox';

import { RenderRemoteData } from 'src/components/RenderRemoteData';

const useMedicalData = () => {
    const patientIdentifier = '30c6c25ed6137e3bd449a405';
    const [medicalResourcesRD] = useService<Bundle>(async () => {
        const response = await service<Bundle, Bundle>({
            url: `/health-gorilla/Patient/${patientIdentifier}/$everything`,
        });
        return response;
    });
    return [medicalResourcesRD];
};

interface MedicalDataProps {}

export function MedicalData({}: MedicalDataProps) {
    const [medicalResourcesRD] = useMedicalData();
    return (
        <>
            <h2>MedicalData</h2>
            <RenderRemoteData remoteData={medicalResourcesRD}>
                {(data: Bundle) => (
                    <>
                        <h5>Total: {data.total}</h5>
                        <ul>
                            {data.entry.slice(0, 10).map((res, index) => (
                                <li
                                    key={index}
                                    onClick={() =>
                                        console.log(
                                            `GET ${res.resource.resourceType}/${res.resource.id}`,
                                        )
                                    }
                                >
                                    {res.resource.resourceType!} ({res.resource.id})
                                </li>
                            ))}
                        </ul>
                        <h6>Only first 10 resources are showed</h6>
                    </>
                )}
            </RenderRemoteData>
        </>
    );
}
