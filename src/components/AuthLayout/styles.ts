import styled, { css } from 'styled-components';

import backgroundImage from './images/background.jpg';
import headerImage from './images/header.jpg';
import illustration1Image from './images/illustration1.jpg';
import illustration2Image from './images/illustration2.jpg';
import illustration3Image from './images/illustration3.jpg';

export const S = {
    Container: styled.div`
        min-height: 100vh;
        position: relative;
        padding: 0 16px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        padding: 8vh 0;
        background-color: #262626;
        background-image: url(${backgroundImage});
        background-size: cover;
        background-position: center;
    `,
    Content: styled.div`
        display: flex;
        flex-direction: row;
        max-width: 916px;
        width: 100%;
        background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
        background-position: center;
        min-height: 500px;
    `,
    Illustration: styled.div<{ $illustrationNumber?: number }>`
        max-width: 532px;
        width: 100%;
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};
        background-image: url(${illustration1Image});
        background-size: cover;
        background-position: center;

        ${({ $illustrationNumber }) =>
            $illustrationNumber === 2 &&
            css`
                background-image: url(${illustration2Image});
            `}

        ${({ $illustrationNumber }) =>
            $illustrationNumber === 3 &&
            css`
                background-image: url(${illustration3Image});
            `}
    `,
    FormContainer: styled.div`
        flex: 1;
    `,
    Header: styled.div`
        width: 384px;
        height: 205px;
        background-color: #000;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-image: url(${headerImage});
        background-size: cover;
    `,
    Form: styled.div`
        padding: 40px;
    `,
};
