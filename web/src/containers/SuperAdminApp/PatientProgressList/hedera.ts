import { Buffer } from 'buffer';

import {
    AccountId,
    PrivateKey,
    TokenAssociateTransaction,
    TokenCreateTransaction,
    TokenId,
    TokenMintTransaction,
    TokenSupplyType,
    TokenType,
    Client,
    AccountCreateTransaction,
    AccountBalanceQuery,
    Hbar,
    TransferTransaction,
    CustomRoyaltyFee,
    CustomFixedFee,
    TokenInfoQuery,
} from '@hashgraph/sdk';

import { CID_ARRAY, MY_ACCOUNT_ID, MY_PRIVATE_KEY, TREASURY_ID, TREASURY_KEY } from './config';

const client = Client.forTestnet().setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);

const adminKey = PrivateKey.generate();
const supplyKey = PrivateKey.generate();
const freezeKey = PrivateKey.generate();
const wipeKey = PrivateKey.generate();

export const createNewNFT = async (patientId: string) => {
    // DEFINE CUSTOM FEE SCHEDULE
    const nftCustomFee = new CustomRoyaltyFee()
        .setNumerator(5)
        .setDenominator(10)
        .setFeeCollectorAccountId(TREASURY_ID)
        .setFallbackFee(new CustomFixedFee().setHbarAmount(new Hbar(200)));

    // IPFS CONTENT IDENTIFIERS FOR WHICH WE WILL CREATE NFTs
    const CID = CID_ARRAY;
    
    // CREATE NFT WITH CUSTOM FEE
    const nftCreate = await new TokenCreateTransaction()
        .setTokenName(patientId)
        .setTokenSymbol(patientId.substring(0, 8))
        .setTokenType(TokenType.NonFungibleUnique)
        .setDecimals(0)
        .setInitialSupply(0)
        .setTreasuryAccountId(TREASURY_ID)
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(CID.length)
        .setCustomFees([nftCustomFee])
        .setAdminKey(adminKey)
        .setSupplyKey(supplyKey)
        // .setPauseKey(pauseKey)
        .setFreezeKey(freezeKey)
        .setWipeKey(wipeKey)
        .freezeWith(client)
        .sign(TREASURY_KEY);

    const nftCreateTxSign = await nftCreate.sign(adminKey);

    const nftCreateSubmit = await nftCreateTxSign.execute(client);

    const nftCreateRx = await nftCreateSubmit.getReceipt(client);

    const tokenId = nftCreateRx.tokenId;

    console.log(`Created NFT with Token ID: ${tokenId?.toString()} \n`);

    // TOKEN QUERY TO CHECK THAT THE CUSTOM FEE SCHEDULE IS ASSOCIATED WITH NFT
    let tokenInfo = await new TokenInfoQuery().setTokenId(tokenId!).execute(client);
    console.table(tokenInfo.customFees[0]);

    // MINT NEW BATCH OF NFTs
    const nftFiles = [];
    for (let i = 0; i < CID.length; i++) {
        nftFiles[i] = await tokenMinterFcn(CID[i], tokenId);
        console.log(
            `Created NFT ${tokenId?.toString()} with serial: ${nftFiles[i].serials[0].toString()}`,
        );
    }

    tokenInfo = await new TokenInfoQuery().setTokenId(tokenId!).execute(client);
    console.log(`Current NFT supply: ${tokenInfo.totalSupply.toString()} \n`);

    return { tokenId, CID };
};

export const associateUserAccountWithNFT = async (
    tokenId: TokenId,
    patientAccountId: AccountId,
    patientAccountKey: PrivateKey,
) => {
    let key = patientAccountKey;
    if (typeof patientAccountKey === 'string') {
        key = PrivateKey.fromString(patientAccountKey);
    }
    // Create the associate transaction and sign with patient's key
    const associatePatientTx = await new TokenAssociateTransaction()
        .setAccountId(patientAccountId)
        .setTokenIds([tokenId])
        .freezeWith(client)
        .sign(key);
    // Submit the transaction to a Hedera network
    const associatePatientTxSubmit = await associatePatientTx.execute(client);
    // Get the transaction receipt
    const associatePatientRx = await associatePatientTxSubmit.getReceipt(client);
    // Confirm the transaction was successful
    console.log(`- NFT association with patient's account: ${associatePatientRx.status}\n`);
};

export const createNewAccount = async () => {
    // Create new keys
    const newAccountPrivateKey = await PrivateKey.generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    // Create a new account with 1,000 tinybar starting balance
    const newAccount = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(0))
        .execute(client);
    // Get the new account ID
    const getReceipt = await newAccount.getReceipt(client);
    const newAccountId = getReceipt.accountId!;
    // Log the account ID
    console.log('The new account ID is: ' + newAccountId);
    console.log('The new account PKey is: ' + newAccountPrivateKey);

    // Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log('The new account balance is: ' + accountBalance.hbars.toTinybars() + ' tinybar.');

    return { accountId: newAccountId, accountKey: newAccountPrivateKey };
};

export const transferNFT = async (
    patientAccountId: AccountId,
    tokenId: TokenId,
    CID: string[] | string,
) => {
    for (let i = 1; i < CID.length + 1; i++) {
        const tokenSerial = i;
        const tokenTransferTx = await new TransferTransaction()
            .addNftTransfer(tokenId, tokenSerial, TREASURY_ID, patientAccountId)
            .freezeWith(client)
            .sign(TREASURY_KEY);
        const tokenTransferSubmit = await tokenTransferTx.execute(client);
        const tokenTransferRx = await tokenTransferSubmit.getReceipt(client);
        console.log(
            `\n NFT transfer Treasury->Patient status: ${tokenTransferRx.status.toString()} \n`,
        );
    }
};

export const patientBalanceCheck = async (patientAccountId: AccountId, tokenId: TokenId) => {
    async function bCheckerFcn(id: AccountId) {
        const balanceCheckTx = await new AccountBalanceQuery().setAccountId(id).execute(client);
        return [balanceCheckTx.tokens?._map.get(tokenId.toString()), balanceCheckTx.hbars];
    }

    const patientBalance = await bCheckerFcn(patientAccountId);

    console.log(
        `- Patient balance: ${patientBalance[0]?.toString()} NFTs of ID:${tokenId.toString()} and ${patientBalance[1]?.toString()}`,
    );
};

async function tokenMinterFcn(CID: string[] | string, tokenId: TokenId | null) {
    const mintTx = new TokenMintTransaction()
        .setTokenId(tokenId!)
        .setMetadata([Buffer.from(CID)])
        .freezeWith(client);
    const mintTxSign = await mintTx.sign(supplyKey);
    const mintTxSubmit = await mintTxSign.execute(client);
    return mintTxSubmit.getReceipt(client);
}

// https://wallet.hashpack.app/
