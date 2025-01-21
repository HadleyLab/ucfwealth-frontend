import styled from 'styled-components';

export const S = {
    Content: styled.div`
        border-radius: 10px;
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};
        color: ${({ theme }) => theme.neutralPalette.gray_13};
        border: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};
        padding: 10px 16px;
    `,
};
