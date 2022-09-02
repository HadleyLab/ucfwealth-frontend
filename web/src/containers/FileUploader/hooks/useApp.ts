import { useEffect, useState } from 'react';

import { isFailure } from 'aidbox-react/src/libs/remoteData';
import { service } from 'aidbox-react/src/services/service';

import { sharedPatientId } from 'src/sharedState';

declare global {
    interface Window {
        gateway?: string;
    }
}

export const useApp = () => {
    const sessionId = sharedPatientId.getSharedState().id;

    const [showLoader, setShowLoader] = useState(true);

    const [contentList, setContentList] = useState<[] | string[]>([]);

    const getData = async () => {
        if (!sessionId) {
            return;
        }
        const response = await service({
            method: 'GET',
            url: '/api/get-data',
            params: { sessionId },
        });

        if (isFailure(response)) {
            console.error(response)
            return [];
        }

        setContentList(response.data.contents.contents);
        setShowLoader(false);

        return response.data.contents.contents;
    };

    useEffect(() => {
        getData();
    }, []);

    return { getData, showLoader, contentList };
};
