import styled from 'styled-components';

export const S = {
    Container: styled.div`
        display: flex;
        flex-direction: row;
        justify-content: center;
        padding: 8vh 0;
    `,
    Form: styled.div`
        max-width: 450px;
        width: 100%;
        display: flex;
        flex-direction: column;
        text-align: center;
        gap: 32px 0;
        padding: 40px;
        background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
    `,
};
