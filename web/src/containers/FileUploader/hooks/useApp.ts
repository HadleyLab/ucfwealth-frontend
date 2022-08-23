import axios from 'axios';
import { useEffect, useState } from 'react';

import { sharedPatientId } from 'src/sharedState';

import { FILE_UPLOADER_BACKEND_URL } from '../config.url';

declare global {
    interface Window {
        gateway?: string;
    }
}

export const useApp = () => {
    const sessionId = sharedPatientId.getSharedState().id;

    const [showLoader, setShowLoader] = useState(true);

    const [contentList, setContentList] = useState<[] | string[]>([]);

    const gateway = window.gateway ?? FILE_UPLOADER_BACKEND_URL;

    const getData = async () => {
        if (!sessionId) {
            return;
        }

        const response = await axios(
            `${gateway}/api/get-data?` +
                new URLSearchParams({
                    sessionId,
                }),
        );

        setContentList(response.data);
        setShowLoader(false);

        return response.data;
    };

    useEffect(() => {
        getData();
    }, []);

    return { getData, showLoader, contentList };
};
