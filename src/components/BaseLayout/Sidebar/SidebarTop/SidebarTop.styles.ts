import { Divider } from 'antd';
import styled from 'styled-components';

import { Text } from '@beda.software/emr/components';

export const S = {
    Container: styled.div<{ $collapsed: boolean }>`
        display: flex;
        flex-direction: column;
        padding: 0 4px;
        gap: 4px;

        .ant-menu {
            background: 0 !important;
        }

        .ant-menu-item {
            display: flex;
            align-items: center;
            flex-direction: ${({ $collapsed }) => ($collapsed ? 'column' : 'row')};
            gap: 0 10px;
            height: 48px !important;
            line-height: 24px !important;
            width: 100% !important;
            margin: 0 !important;
            color: ${({ theme }) => theme.neutral.primaryText} !important;
            border-radius: 6px !important;
            transition: height 0.2s;
            padding: ${({ $collapsed }) => ($collapsed ? '12px 24px' : '12px 16px')} !important;
            transition: all 0.2s;
        }

        .ant-menu-item-icon {
            min-width: 24px !important;
            min-height: 24px !important;
        }

        .ant-menu-title-content {
            margin: 0 !important;
            opacity: 1 !important;
        }

        .ant-menu-item:hover:not(.ant-menu-item-selected) {
            background: 0 !important;
            color: ${({ theme }) => theme.primary} !important;
        }

        .ant-menu-item.ant-menu-item-selected {
            background-color: ${({ theme }) => theme.neutralPalette.gray_3} !important;
            color: ${({ theme }) => theme.neutralPalette.gray_13} !important;
        }
    `,
    Divider: styled(Divider)`
        margin: 0;
    `,
    Logo: styled.div`
        height: 32px;
        width: 32px;
        min-width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            max-height: 32px;
            max-width: 32px;
        }
    `,
    Name: styled(Text)`
        color: #ea80b0;
        font-size: 18px;
        line-height: 18px;
        margin-top: 10px;
        font-weight: 700;
        white-space: nowrap;
    `,
};
