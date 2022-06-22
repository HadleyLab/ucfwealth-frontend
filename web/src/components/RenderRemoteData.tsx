import { Spin } from 'antd';
import React from 'react';

import {
    isFailure,
    isLoading,
    isNotAsked,
    isSuccess,
    RemoteData,
} from 'aidbox-react/src/libs/remoteData';
import { formatError } from 'aidbox-react/src/utils/error';

interface RenderRemoteDataProps<S, E = any> {
    remoteData: RemoteData<S, E>;
    children: (data: S) => React.ReactElement;
    renderFailure?: (error: E) => React.ReactElement;
    renderLoading?: () => React.ReactElement;
    renderNotAsked?: () => React.ReactElement;
}

function renderFailureDefault<E>(error: E) {
    return <p>{formatError(error)}</p>;
}

function renderLoadingDefault() {
    return <Spin />;
}

// TODO: Add fabric that binds optional functions to RenderRemoteData component

export function RenderRemoteData<S>(props: RenderRemoteDataProps<S>) {
    const { remoteData, children, renderFailure, renderLoading, renderNotAsked } = props;
    if (isNotAsked(remoteData)) {
        return renderNotAsked ? renderNotAsked() : null;
    } else if (isLoading(remoteData)) {
        return (renderLoading ?? renderLoadingDefault)();
    } else if (isFailure(remoteData)) {
        return (renderFailure ?? renderFailureDefault)(remoteData.error);
    } else if (isSuccess(remoteData)) {
        return children(remoteData.data);
    } else {
        const n: never = remoteData;
        throw new Error(n);
    }
}
