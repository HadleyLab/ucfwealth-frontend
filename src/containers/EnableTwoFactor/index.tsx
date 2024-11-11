import { Alert, Button, Input } from 'antd';
import React, { useEffect } from 'react';

import { Title } from '@beda.software/emr/components';
import { formatError } from '@beda.software/fhir-react';
import { RemoteData, isNotAsked, isSuccess, loading, notAsked } from '@beda.software/remote-data';

import { requestTwoFactor, confirmTwoFactor } from 'src/services/two-factor';

import { S } from './styles';

interface Props {
    reload: () => void;
}

interface ConfirmationState {
    uri?: string;
}

function useTwoFactor(props: Props) {
    const [token, setToken] = React.useState('');
    const [error, setError] = React.useState<string | undefined>();
    const { reload } = props;
    const [confirmationState, setConfirmationState] = React.useState<RemoteData<ConfirmationState | null>>(notAsked);

    const request = async (transport?: string) => {
        setConfirmationState(loading);
        const response = await requestTwoFactor({ transport });

        if (isSuccess(response)) {
            setConfirmationState(response);
        } else {
            alert(formatError(response.error));
        }
    };

    const confirm = async () => {
        setError(undefined);

        const response = await confirmTwoFactor({ token });

        if (isSuccess(response)) {
            reload();
        } else {
            setError(formatError(response.error));
        }
    };

    useEffect(() => {
        (async () => {
            if (isNotAsked(confirmationState)) {
                await request('email');
            }
        })();
    }, [confirmationState]);

    return { confirmationState, request, confirm, token, setToken, error };
}

export function EnableTwoFactor(props: Props) {
    const { confirm, setToken, token, error } = useTwoFactor(props);

    return (
        <S.Container>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    return confirm();
                }}
            >
                <S.Form>
                    <Title level={5}>
                        Check your email for the token to finish setting up two-factor authentication. Input the token
                        you received
                    </Title>
                    {error && <Alert message={error} type="error" />}
                    <Input
                        type="number"
                        autoComplete="off"
                        autoFocus
                        name="token"
                        placeholder="Input token here"
                        value={token}
                        onChange={(event) => setToken(event.currentTarget.value)}
                    />
                    <Button type="primary" size="large" htmlType="submit">
                        Confirm
                    </Button>
                </S.Form>
            </form>
        </S.Container>
    );
}
