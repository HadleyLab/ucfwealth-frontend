import axios from 'axios';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { FILE_UPLOADER_BACKEND_URL } from '../config.url';

declare global {
    interface Window {
        gateway?: string;
    }
}

export const useApp = () => {
    const sessionIdFromUrl = window.location.pathname.split('/')[2];

    if (sessionIdFromUrl === '') {
        const sessionId = localStorage.getItem('sessionId');
        const uuid = uuidv4();

        if (!sessionId) {
            localStorage.setItem('sessionId', uuid);
        }
    } else {
        localStorage.setItem('sessionId', sessionIdFromUrl);
    }

    const [showLoader, setShowLoader] = useState(true);

    const [contentList, setContentList] = useState<[] | string[]>([]);

    const gateway = window.gateway ?? FILE_UPLOADER_BACKEND_URL;

    const sessionId = localStorage.getItem('sessionId');

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
