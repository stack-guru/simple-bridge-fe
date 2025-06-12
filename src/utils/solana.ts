import * as anchor from "@coral-xyz/anchor"
import {
    getAssociatedTokenAddress
} from "@solana/spl-token"
import { PublicKey, Connection, type PublicKeyInitData } from "@solana/web3.js";
import { utils } from '@wormhole-foundation/sdk-solana';
import {
    wormhole,
    Wormhole,
    type ChainAddress,
    ChainContext,
    type Network,
    type Signer,
    type Chain,
    type TokenId,
    isTokenId,
    signSendWait
} from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import { utils as solanaCoreUtils } from "@wormhole-foundation/sdk-solana-core";
import { DECIMAL, WOMRHOLE_CORE_ADDRESS, TEST_USDV_SOLANA, TEST_USDT, SOLANA_ADDRESS, ETH_PRIVATE_KEY, SOL_PRIVATE_KEY, POLY_USDT, POLYGON_ADDRESS } from "./constants"
import { type AnchorWallet, type WalletContextState } from "@solana/wallet-adapter-react";
import { Buffer } from 'buffer';
import { postVaaSolana } from "@certusone/wormhole-sdk/lib/cjs/solana";
import { parseVaa } from "@certusone/wormhole-sdk/lib/cjs/vaa";
import { type ChainId, chainToChainId } from "@wormhole-foundation/sdk";
import { toHex } from "./polygon";

const realConfig = utils.deriveAddress([Buffer.from("config")], SOLANA_ADDRESS);
const mint = new PublicKey(TEST_USDV_SOLANA)

function parseUnits(amount: string, decimals: number): number {
    return Number(Math.floor(Number(amount) * 10 ** decimals))
}

function deriveWormholeMessageKey(
    programId: PublicKeyInitData,
    sequence: bigint
) {
    return utils.deriveAddress(
        [
            Buffer.from("sent"),
            (() => {
                const buf = Buffer.alloc(8);
                buf.writeBigUInt64LE(sequence);
                return buf;
            })(),
        ],
        programId
    );
}

function deriveForeignEmitterKey(
    programId: PublicKeyInitData,
    chain: ChainId
) {
    return utils.deriveAddress(
        [
            Buffer.from("foreign_emitter"),
            (() => {
                const buf = Buffer.alloc(2);
                buf.writeUInt16LE(chain);
                return buf;
            })(),
        ],
        programId
    );
}

function deriveReceivedKey(
    programId: PublicKeyInitData,
    chain: ChainId,
    sequence: bigint
) {
    return utils.deriveAddress(
        [
            Buffer.from("received"),
            (() => {
                const buf = Buffer.alloc(10);
                buf.writeUInt16LE(chain, 0);
                buf.writeBigInt64LE(sequence, 2);
                return buf;
            })(),
        ],
        programId
    );
}

// Signer setup function for different blockchain platforms
export async function getSigner<N extends Network, C extends Chain>(
    chain: ChainContext<N, C>,
    gasLimit?: bigint
): Promise<{
    chain: ChainContext<N, C>;
    signer: Signer<N, C>;
    address: ChainAddress<C>;
}> {
    let signer: Signer;
    const platform = chain.platform.utils()._platform;

    switch (platform) {
        case 'Solana':
            signer = await (
                await solana()
            ).getSigner(await chain.getRpc(), SOL_PRIVATE_KEY);
            break;
        case 'Evm':
            const evmSignerOptions = gasLimit ? { gasLimit } : {};
            signer = await (
                await evm()
            ).getSigner(
                await chain.getRpc(),
                ETH_PRIVATE_KEY,
                evmSignerOptions
            );
            break;
        default:
            throw new Error('Unsupported platform: ' + platform);
    }

    return {
        chain,
        signer: signer as Signer<N, C>,
        address: Wormhole.chainAddress(chain.chain, signer.address()),
    };
}

export const getWToken = async () => {
    const wh = await wormhole("Testnet", [evm, solana]);

    const sendChain = wh.getChain('PolygonSepolia');
    const destChain = wh.getChain('Solana');

    const token = Wormhole.tokenId(sendChain.chain, TEST_USDT);

    const tbDest = await destChain.getTokenBridge();
    try {
        const wrapped = await tbDest.getWrappedAsset(token);
        console.log(
            `Token already wrapped on ${destChain.chain}. Skipping attestation.`
        );
        return { chain: destChain.chain, address: wrapped };
    } catch (e) {
        console.log('e = ', e)
        console.log(
            `No wrapped token found on ${destChain.chain}. Proceeding with attestation.`
        );
    }
}

export const setAttestation = async () => {
    const wh = await wormhole('Testnet', [evm, solana]);

    const srcChain = wh.getChain('PolygonSepolia');
    const destChain = wh.getChain('BaseSepolia');

    const token = Wormhole.tokenId(srcChain.chain, TEST_USDT);
    const { signer: origSigner } = await getSigner(srcChain);
    const { signer: destSigner } = await getSigner(destChain);
    const tbOrig = await srcChain.getTokenBridge();
    const tbDest = await destChain.getTokenBridge();

    const attestTxns = tbOrig.createAttestation(
        token.address,
        Wormhole.parseAddress(origSigner.chain(), origSigner.address())
    );

    const txids = await signSendWait(srcChain, attestTxns, origSigner);
    const txid = txids[0]!.txid;
    console.log('Created attestation (save this): ', txid);

    // Retrieve the Wormhole message ID from the attestation transaction
    const msgs = await srcChain.parseTransaction(txid);

    const timeout = 25 * 60 * 1000;
    const vaa = await wh.getVaa(msgs[0]!, 'TokenBridge:AttestMeta', timeout);
    if (!vaa) {
        throw new Error(
            'VAA not found after retries exhausted. Try extending the timeout.'
        );
    }

    // Submit the attestation on the destination chain
    const subAttestation = tbDest.submitAttestation(
        vaa,
        Wormhole.parseAddress(destSigner.chain(), destSigner.address())
    );

    console.log('subAttestation = ', subAttestation)

    const tsx = await signSendWait(destChain, subAttestation, destSigner);
    console.log('Transaction hash: ', tsx);

    // Poll for the wrapped asset until it's available
    async function waitForIt() {
        do {
            try {
                const wrapped = await tbDest.getWrappedAsset(token);
                return { chain: destChain.chain, address: wrapped };
            } catch (e) {
                console.error('Wrapped asset not found yet. Retrying...');
            }
            await new Promise((r) => setTimeout(r, 2000));
        } while (true);
    }

    console.log('Wrapped Asset: ', await waitForIt());
}

export const burnAndSend = async (program: any, amount: string, connection: Connection, wallet: AnchorWallet) => {
    try {
        const burnAmount = parseUnits(amount, DECIMAL)
        console.log('burn amount = ', burnAmount)

        const sequence = (
            await solanaCoreUtils.getProgramSequenceTracker(connection, program.programId, WOMRHOLE_CORE_ADDRESS)
        ).value() + 1n;
        console.log('sequence = ', sequence);

        const wormholeCpi = solanaCoreUtils.getPostMessageCpiAccounts(
            program.programId,
            WOMRHOLE_CORE_ADDRESS,
            wallet.publicKey,
            deriveWormholeMessageKey(program.programId, sequence) // sequence should be increased for every test
        )
        console.log('wormholeCpi = ', wormholeCpi)

        const userTokenAccount = await getAssociatedTokenAddress(
            mint,
            wallet.publicKey
        );
        console.log('userTokenAccount = ', userTokenAccount)

        const tx = await program.methods
            .burnAndSend(new anchor.BN(burnAmount))
            .accounts({
                payer: wallet.publicKey,
                config: realConfig,
                wormholeProgram: WOMRHOLE_CORE_ADDRESS,
                wormholeBridge: wormholeCpi.wormholeBridge,
                wormholeFeeCollector: wormholeCpi.wormholeFeeCollector,
                wormholeEmitter: wormholeCpi.wormholeEmitter,
                wormholeSequence: wormholeCpi.wormholeSequence,
                wormholeMessage: wormholeCpi.wormholeMessage,
                clock: wormholeCpi.clock,
                rent: wormholeCpi.rent,
                user: wallet.publicKey,
                userTokenAccount,
                tokenMint: mint,
                tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            })
            .rpc()

        console.log("Burn + Wormhole Message Tx:", tx)
        return tx
    } catch (err) {
        throw err
    }
}

export const registerForeignEmitter = async (program: any, wallet: WalletContextState) => {
    const realForeignEmitter = deriveForeignEmitterKey(program.programId, chainToChainId("PolygonSepolia"));
    const realForeignEmitterAddress = Buffer.from(
        POLYGON_ADDRESS.toLowerCase().replace(/^0x/, "").padStart(64, "0"),
        "hex"
    );

    const realRegisterEmitterAccounts = {
        owner: wallet.publicKey,
        config: realConfig,
        foreignEmitter: realForeignEmitter,
    }

    try {
        const trx = await program.methods
            .registerEmitter(chainToChainId("PolygonSepolia"), [...realForeignEmitterAddress])
            .accounts({ ...realRegisterEmitterAccounts })
            .rpc();

        console.log('register emitter trx = ', trx);
    } catch (err) {
        console.log('error: ', err)
    }
}

export const receiveMsgSolana = async (program: any, connection: Connection, wallet: WalletContextState, vaaBytes: Uint8Array) => {
    try {

        const buffer = Buffer.from(vaaBytes)
        const posted = await postVaaSolana(
            connection,
            wallet.signTransaction!,
            WOMRHOLE_CORE_ADDRESS,
            wallet.publicKey!,
            buffer
        )
        console.log('posted = ', posted)
        const parsed = parseVaa(buffer)
        console.log('parsed = ', parsed)

        const userTokenAccount = await getAssociatedTokenAddress(
            mint,
            wallet.publicKey!
        );

        const mintAuthorityPda = utils.deriveAddress([Buffer.from("mint_authority")], program.programId);

        const trx = await program.methods
            .receiveAndMint([...parsed.hash])
            .accounts({
                payer: wallet.publicKey!,
                config: realConfig,
                wormholeProgram: new PublicKey(WOMRHOLE_CORE_ADDRESS),
                posted: solanaCoreUtils.derivePostedVaaKey(WOMRHOLE_CORE_ADDRESS, parsed.hash),
                foreignEmitter: deriveForeignEmitterKey(program.programId, parsed.emitterChain as ChainId),
                received: deriveReceivedKey(
                    program.programId,
                    parsed.emitterChain as ChainId,
                    parsed.sequence
                ),
                user: wallet.publicKey,
                userTokenAccount,
                tokenMint: mint,
                mintAuthority: mintAuthorityPda,
                tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            })
            .rpc();
        console.log('transaction = ', trx)

        return trx
    } catch (err) {
        console.log(err)
    }

    return null
}

export async function getSolanaVaa(trx: string) {
    try {
        const wh = await wormhole("Testnet", [solana]);
        const chain = wh.getChain("Solana");
        const [whm] = await chain.parseTransaction(trx);
        const vaaBytes = await wh.getVaaBytes(whm!, 60_000);
        const hex = toHex(vaaBytes!);

        return hex;
    } catch (err) {
        console.log('get evm vaa: ', err);
    }

    return null;
}