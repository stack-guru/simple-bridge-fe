import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { erc20Abi, parseUnits } from 'viem'
import { polygonAmoy } from 'viem/chains'
import { wormhole } from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import { TEST_USDT } from './constants'

export function shrinkAddress(address: string, length = 4): string {
  if (!address) return ""
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`
}

export async function airdrop(user: any) {
  try {

    const pk = import.meta.env.VITE_USDT_OWNER_PK;
    const account = privateKeyToAccount(pk)

    const client = createWalletClient({
      account,
      chain: polygonAmoy,
      transport: http(polygonAmoy.rpcUrls.default.http[0]),
    })

    const transfered = await client.writeContract({
      address: TEST_USDT,
      abi: erc20Abi,
      functionName: "transfer",
      args: [user, parseUnits("10", 6)],
    })

    return transfered
  } catch (err) {
    console.log('air drop err: ', err)
  }

  return null
}

export function toHex(bytes: Uint8Array): string {
  return '0x' + Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function getEvmVaa(trx: string) {
  try {
    const wh = await wormhole("Testnet", [evm]);
    const chain = wh.getChain("PolygonSepolia");
    const [whm] = await chain.parseTransaction(trx);
    const vaaBytes = await wh.getVaaBytes(whm!, 900_000);
    // const vaa = await wh.getVaa(whm!, "Uint8Array", 90_000);
    // console.log('vaa = ', vaa);
    console.log('bytes = ', vaaBytes);
    // const hex = toHex(vaaBytes!);

    return vaaBytes
  } catch (err) {
    console.log('get evm vaa: ', err);
  }

  return null
}