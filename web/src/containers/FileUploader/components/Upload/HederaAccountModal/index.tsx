import { Button, Input } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { useState } from 'react';

import s from './HederaAccountModal.module.scss';

interface Props {
    accountCredentials: [accountId: string, accountKey: string];
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
}

export const HederaAccountModal = ({ accountCredentials, showModal, setShowModal }: Props) => {
    const [showPassword, setShowPassword] = useState(false);

    const [accountId, accountKey] = accountCredentials;

    return (
        <>
            <Modal
                title="Crypto wallet access"
                visible={showModal}
                onOk={() => setShowModal(false)}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <div className={s.useitToAccessYourNFTs}>
                    <div className={s.useitToAccessYourNFTsText}>
                        Use it to access your NFTs. You can exchange NFTs to medical service.
                        Please, save it securely on your device. It will be not available once you
                        close the window.
                    </div>
                </div>
                <div className={s.credentialsContainer}>
                    <div className={s.label}>Account ID</div>
                    <div className={s.accountIdPasswordContainer}>
                        <Input value={accountId} readOnly/>
                    </div>
                    <div className={s.label}>Private Key</div>
                    <div className={s.accountIdPasswordContainer}>
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            value={accountKey}
                            readOnly
                        />
                        <Button onClick={() => setShowPassword(!showPassword)}>Show</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
