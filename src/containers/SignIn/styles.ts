import styled from 'styled-components';

import { Text } from '@beda.software/emr/components';

export const S = {
    Content: styled.div`
        display: flex;
        flex-direction: column;
    `,
    Buttons: styled.div`
        display: flex;
        gap: 12px;
    `,
    ForgotPassword: styled.div`
        display: flex;
        justify-content: center;
        margin-top: 10px;
    `,
    EntryMessage: styled(Text)`
        font-size: 12px;
        line-height: 18px;
        color: ${({ theme }) => theme.neutral.secondaryText};
        margin-bottom: 16px;
    `,
};
