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
};
