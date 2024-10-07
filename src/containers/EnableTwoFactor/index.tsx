import React from 'react';

import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { formatError } from 'aidbox-react/lib/utils/error';

import { requestTwoFactor, confirmTwoFactor } from 'src/services/two-factor';

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
    const [confirmationState, setConfirmationState] = React.useState<ConfirmationState | null>(
        null,
    );

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
    const {
        confirmationState,
        request,
        confirm,
        setToken,
        token,
        error
    } = useTwoFactor(props);

    if (confirmationState) {
        return (
            <div>
                <div>
                    <div>Input the token to finish setting up two-factor authentication</div>
                </div>
                <br/>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    return confirm();
                }}>
                    {error && <div>{error}</div>}

                    <input
                        type="number"
                        autoComplete="off"
                        autoFocus
                        name="token"
                        placeholder="Input token here"
                        value={token}
                        onChange={(event) => setToken(event.currentTarget.value)}
                    />
                    <button type="submit">Confirm</button>
                </form>
            </div>
        );
    }

    return (
        <div>
            <div>Do you want to enable two-factor authentication using email?</div>
            <br/>
            <br/>
            <div>
                <button onClick={() => request('email')}>
                    Enable
                </button>
            </div>
        </div>
    );
}

