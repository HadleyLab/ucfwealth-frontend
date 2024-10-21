import styled from 'styled-components';

import { Text } from '@beda.software/emr/components';

export const S = {
    Container: styled.div`
        display: flex;
        flex-direction: column;
    `,
    Title: styled(Text)`
        color: ${({ theme }) => theme.secondary};
        font-size: 24px;
        line-height: 32px;
        font-weight: 600;
        margin-bottom: 24px;
    `,
    Buttons: styled.div`
        display: flex;
        gap: 12px;
        margin-top: 32px;
    `,
    Message: styled(Text)`
        margin-bottom: 32px;
    `,
    EntryMessage: styled(Text)`
        font-size: 12px;
        line-height: 18px;
        color: ${({ theme }) => theme.neutral.secondaryText};
        margin-bottom: 16px;
    `,
    Footer: styled.div`
        margin-top: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
    `,
    FooterText: styled(Text)`
        color: ${({ theme }) => theme.neutral.secondaryText};
    `,
};
