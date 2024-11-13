import styled from 'styled-components';

import { Title } from '@beda.software/emr/components';

export const S = {
    Footer: styled.footer`
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 144px;
        display: flex;
        align-items: center;
        justify-content: center;

        --footer-text: ${({ theme }) => theme.neutralPalette.gray_7};
        --footer-link-active: ${({ theme }) => theme.primaryPalette.bcp_6};

        &._light {
            --footer-text: rgba(255, 255, 255, 0.75);
            --footer-link-active: #fff;
        }

        @media screen and (max-width: 1024px) {
            position: static;
            height: auto;
        }
    `,
    Content: styled.div`
        padding: 0 24px;
        display: flex;
        flex-direction: column;
    `,
    Title: styled(Title)`
        margin-bottom: 0 !important;
    `,
    Contacts: styled.div`
        color: var(--footer-text);
        font-size: 14px;
        line-height: 22px;
        display: flex;
        flex-direction: row;
        gap: 32px;
        margin-top: 12px;
        flex-wrap: wrap;
    `,
    Contact: styled.div`
        display: flex;
        gap: 12px;
    `,
    Image: styled.img`
        width: 66px;
        height: 66px;
    `,
    ContactDetails: styled.div`
        display: flex;
        flex-direction: column;
    `,
    Link: styled.a`
        color: var(--footer-text);
        transition: color 0.2s;
        text-decoration: underline;

        &:hover {
            color: var(--footer-link-active);
            text-decoration: underline;
        }
    `,
};
