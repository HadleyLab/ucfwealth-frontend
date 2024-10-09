import { Alert, Button, Input } from 'antd';
import React from 'react';

import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { formatError } from 'aidbox-react/lib/utils/error';

import { Title } from '@beda.software/emr/components';

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
    const [confirmationState, setConfirmationState] = React.useState<ConfirmationState | null>(null);

    const request = async (transport?: string) => {
        const response = await requestTwoFactor({ transport });

        if (isSuccess(response)) {
            setConfirmationState(response.data);
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

    return { confirmationState, request, confirm, token, setToken, error };
}

export function EnableTwoFactor(props: Props) {
    const { confirmationState, request, confirm, setToken, token, error } = useTwoFactor(props);

    if (confirmationState) {
        return (
            <S.Container>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        return confirm();
                    }}
                >
                    <S.Form>
                        <Title level={5}>Input the token to finish setting up two-factor authentication</Title>
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

    return (
        <S.Container>
            <S.Form>
                <Title level={5}>Do you want to enable two-factor authentication using email?</Title>
                <Button type="primary" size="large" onClick={() => request('email')}>
                    Enable
                </Button>
            </S.Form>
        </S.Container>
    );
}
