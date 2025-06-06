import { Button, Box, Heading, Card, HStack, VStack, Center, Icon, Input, Field, Text, Separator, Spinner } from "@chakra-ui/react"
import { useAccount, useWriteContract, usePublicClient } from 'wagmi'
import { readContract } from '@wagmi/core'
import { Toaster, toaster } from "@/components/ui/toaster"
import { erc20Abi, parseUnits } from "viem"
import { useState } from "react"
import { config } from "@/assets/config"
import { POLYGON_ADDRESS, TEST_USDT } from "@/utils/constants"
import { airdrop } from "@/utils/func"
import { abi } from "@/assets/abi"

export default function Polygon() {
    const account = useAccount()
    const pClient = usePublicClient()

    const [mintAmount, setMintAmount] = useState("")
    const { writeContractAsync } = useWriteContract()
    const [isAirdrop, setIsAirdrop] = useState(false)

    const getAirdrop = async () => {
        setIsAirdrop(true)
        const trx = await airdrop(account.address)
        if (trx) {
            await pClient?.waitForTransactionReceipt({ hash: trx })
            toaster.create({
                description: "Airdropped!",
                type: "success"
            })
        }
        setIsAirdrop(false)
    }

    const mintUSDV = async () => {
        if (!mintAmount) {
            toaster.create({
                description: "Please input token amount",
                type: "error"
            })

            return
        }

        const allowance = await readContract(config, {
            abi: erc20Abi,
            address: TEST_USDT,
            functionName: 'allowance',
            args: [account.address!, POLYGON_ADDRESS],
        })
        console.log('allowance = ', allowance)

        try {
            const approved = await writeContractAsync({
                abi: erc20Abi,
                address: TEST_USDT,
                functionName: "approve",
                args: [
                    POLYGON_ADDRESS,
                    parseUnits(mintAmount, 6)
                ]
            })
            await pClient?.waitForTransactionReceipt({ hash: approved })
            toaster.create({
                description: "Approved!",
                type: "info"
            })

            const realAmount = Number(mintAmount) * 0.999
            writeContractAsync({
                abi,
                address: POLYGON_ADDRESS,
                functionName: 'mintToken',
                args: [
                    parseUnits(realAmount.toString(), 6)
                ],
            })
        } catch (err) {
            console.log('err: ', err)
        }
    }

    return (
        <Card.Root width={"540px"}>
            <Card.Header>
                <Card.Title>Get USDV on Solana</Card.Title>
            </Card.Header>
            <Card.Body>
                <Text fontSize={"sm"} marginBottom={2}>Airdrop TEST USDT</Text>
                <Button onClick={getAirdrop} disabled={isAirdrop}>
                    {
                        isAirdrop ? <Spinner /> : <Text>Airdrop 10</Text>
                    }
                </Button>
                <Separator marginY={4} />

                <Text fontSize={"sm"} marginBottom={2}>Mint USDV (USDT{"->"}USDV)</Text>
                <HStack>
                    <Input type="number" placeholder="Amount" value={mintAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMintAmount(e.target.value)} />
                    <Button onClick={mintUSDV}>Mint</Button>
                </HStack>
                <Separator marginY={4} />
            </Card.Body>
            <Card.Footer justifyContent={"center"}>
                <Button marginTop={4}>Get</Button>
            </Card.Footer>
        </Card.Root>
    )
}