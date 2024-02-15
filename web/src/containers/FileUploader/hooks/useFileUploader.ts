import { useCallback, useEffect, useState } from 'react';

import { isFailure } from 'aidbox-react/src/libs/remoteData';
import { service } from 'aidbox-react/src/services/service';

import { sharedPatientId } from 'src/sharedState';

declare global {
    interface Window {
        gateway?: string;
    }
}

export interface DicomContent {
    contents: {
        contents: string[];
    };
}

export const getContentList = async (sessionId: string): Promise<string[]> => {
    if (!sessionId) {
        return [];
    }
    const response = await service<DicomContent>({
        method: 'GET',
        url: '/api/get-data',
        params: { sessionId },
    });
    if (isFailure(response)) {
        console.error(response);
        return [];
    }
    return response.data.contents.contents;
};

export const useFileUploader = () => {
    const [showLoader, setShowLoader] = useState(true);
    const [contentList, setContentList] = useState<string[]>([]);

    const sessionId = sharedPatientId.getSharedState().id;

    const getData = useCallback(async () => {
        const contents = await getContentList(sessionId);
        setContentList(contents);
        setShowLoader(false);
    }, [sessionId]);

    useEffect(() => {
        getData();
    }, [getData]);

    return { getData, showLoader, contentList };
};
