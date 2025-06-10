import * as anchor from "@coral-xyz/anchor"
import {
    getAccount,
    getAssociatedTokenAddress
} from "@solana/spl-token"
import { PublicKey, Connection, type PublicKeyInitData } from "@solana/web3.js";
import { utils } from '@wormhole-foundation/sdk-solana';
import { utils as solanaCoreUtils } from "@wormhole-foundation/sdk-solana-core";
import { DECIMAL, WOMRHOLE_CORE_ADDRESS, TEST_USDV_SOLANA, SOLANA_ADDRESS } from "./constants"
import { type AnchorWallet } from "@solana/wallet-adapter-react";

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

export const burnAndSend = async (program: any, amount: string, connection: Connection, wallet: AnchorWallet) => {
    try {
        const burnAmount = parseUnits(amount, DECIMAL)

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

        const userTokenAccount = await getAssociatedTokenAddress(
            mint,
            wallet.publicKey
        );

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
    } catch (err) {
        console.log('burn and send err: ', err)
    }
}