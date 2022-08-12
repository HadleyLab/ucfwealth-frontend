import { useState } from 'react';

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
            {showModal && (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-[#00000070]">
                        <div className="relative w-4/12 my-6 mx-auto max-w-3xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="flex flex-col items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                                    <h3 className="text-3xl font-semibold">Crypto wallet access</h3>
                                    <div className="font-semibold text-gray-400 mt-2">
                                        Use it to access your NFTs. You can exchange NFTs to medical
                                        service. Please, save it securely on your device. It will be
                                        not available once you close the window.
                                    </div>
                                </div>
                                <div className="relative p-6 flex-auto">
                                    <div>Account ID</div>
                                    <div className="flex justify-between">
                                        <input value={accountId} className="w-72 h-10" readOnly />
                                    </div>
                                    <div className="mt-4">Private Key</div>
                                    <div className="flex justify-between">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={accountKey}
                                            className="w-full h-10"
                                            readOnly
                                        />
                                        <button
                                            className="py-2 px-4 font-semibold rounded-full text-white buttonStyle ml-4"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            Show
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        className="py-2 px-4 font-semibold rounded-full text-white buttonStyle"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
