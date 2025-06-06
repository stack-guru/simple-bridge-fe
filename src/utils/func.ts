import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { erc20Abi, parseUnits } from 'viem'
import { polygonAmoy } from 'viem/chains'
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