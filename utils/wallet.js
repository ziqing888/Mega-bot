import crypto from 'crypto';
import ethUtil from 'ethereumjs-util';

export function generateWallet() {
    const privateKey = crypto.randomBytes(32);
    const privateKeyHex = `0x${privateKey.toString('hex')}`;

    const publicKey = ethUtil.privateToPublic(privateKey);
    const publicKeyHex = `0x${publicKey.toString('hex')}`;

    const address = `0x${ethUtil.publicToAddress(publicKey).toString('hex')}`;

    return {
        address: address,
        privateKey: privateKeyHex,
    };
}

export async function signMessage(wallet) {
    const message = `megafin.xyz requests you to sign in with your wallet address: ${wallet.address}`;
    const messageHash = ethUtil.hashPersonalMessage(Buffer.from(message));
    const signature = ethUtil.ecsign(
        messageHash,
        Buffer.from(wallet.privateKey.replace('0x', ''), 'hex')
    );
    return ethUtil.toRpcSig(signature.v, signature.r, signature.s);
}
