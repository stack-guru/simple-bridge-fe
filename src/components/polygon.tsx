import { useState } from "react"
import { Button, Card, HStack, Input, Text, Separator } from "@chakra-ui/react"
import { useAccount, useWriteContract, usePublicClient } from 'wagmi'
import { useWallet } from "@solana/wallet-adapter-react"
import { readContract } from '@wagmi/core'
import { toaster } from "@/components/ui/toaster"
import { erc20Abi, parseUnits } from "viem"
import useProgram from "@/hooks/useProgram"
import { config } from "@/assets/config"
import { POLYGON_ADDRESS, TEST_USDT } from "@/utils/constants"
import { airdrop, getEvmVaa } from "@/utils/polygon"
import { receiveMsgSolana } from "@/utils/solana"
import { abi } from "@/assets/abi"

export default function Polygon() {
    const account = useAccount()
    const pClient = usePublicClient()
    const solWallet = useWallet()
    const { program, connection } = useProgram()

    const [mintAmount, setMintAmount] = useState("")
    const [transferAmount, setTransferAmount] = useState("")
    const { writeContractAsync } = useWriteContract()
    const [isAirdrop, setIsAirdrop] = useState(false)
    const [isMint, setIsMint] = useState(false)
    const [isTransfer, setIsTransfer] = useState(false)
    const [loadingText, setLoadingText] = useState("")

    const getAirdrop = async () => {
        setIsAirdrop(true)
        const trx = await airdrop(account.address)
        if (trx) {
            const state = await pClient?.waitForTransactionReceipt({ hash: trx })
            state?.status === "success" && toaster.create({
                description: "Airdropped!",
                type: "success"
            })
        }
        setIsAirdrop(false)
    }

    const mintUSDV = async () => {
        if (!mintAmount) {
            toaster.create({
                description: "Please input mint amount",
                type: "error"
            })

            return
        }

        setIsMint(true)
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
            const state = await pClient?.waitForTransactionReceipt({ hash: approved })
            if (state?.status === "success") {
                toaster.create({
                    description: "Approved!",
                    type: "info"
                })

                const realAmount = Number(mintAmount) * 0.999
                const minted = await writeContractAsync({
                    abi,
                    address: POLYGON_ADDRESS,
                    functionName: 'mintToken',
                    args: [
                        parseUnits(realAmount.toString(), 6)
                    ],
                })
                const state = await pClient?.waitForTransactionReceipt({ hash: minted })
                if (state?.status === "success") {
                    toaster.create({
                        description: "Minted!",
                        type: "success"
                    })
                }
            }
        } catch (err) {
            console.log('err: ', err)
        }
        setIsMint(false)
    }

    const transferUSDV = async () => {
        if (!transferAmount) {
            toaster.create({
                description: "Please input transfer amount",
                type: "error"
            })

            return
        }

        if (!solWallet.connected) {
            toaster.create({
                description: "Please connect phantom wallet",
                type: "error"
            })

            return
        }

        setIsTransfer(true)
        try {
            const sent = await writeContractAsync({
                abi,
                address: POLYGON_ADDRESS,
                functionName: "burnForWUSDV",
                args: [
                    parseUnits(transferAmount, 6)
                ],
            })
            const state = await pClient?.waitForTransactionReceipt({ hash: sent })

            if (state?.status === "success") {
                console.log('sent trx = ', sent)
                setLoadingText("Searching Wormhole. This may take few minutes.")
                const vaaBytes = await getEvmVaa(sent)
                setLoadingText("")

                if (vaaBytes) {
                    const received = await receiveMsgSolana(program, connection, solWallet, vaaBytes)

                    if (received) {
                        toaster.create({
                            description: "Transfered!",
                            type: "success"
                        })
                    } else {
                        toaster.create({
                            description: "Error on Solana",
                            type: "error"
                        })
                    }
                } else {
                    toaster.create({
                        description: "Wormhole scan error",
                        type: "error"
                    })
                }
            }
        } catch (err) {
            console.log('transfer err: ', err)
        }
        setIsTransfer(false)
    }

    return (
        <Card.Root width={"540px"}>
            <Card.Header>
                <Card.Title>Get USDV on Solana (Polygon to Solana)</Card.Title>
            </Card.Header>
            <Card.Body>
                <Text fontSize={"sm"} marginBottom={2}>Airdrop TEST USDT</Text>
                <Button onClick={getAirdrop} loading={isAirdrop}>
                    Airdrop 10
                </Button>
                <Separator marginY={4} />

                <Text fontSize={"sm"} marginBottom={2}>Mint USDV (USDT{"->"}USDV)</Text>
                <HStack>
                    <Input type="number" placeholder="Amount" value={mintAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMintAmount(e.target.value)} />
                    <Button onClick={mintUSDV} loading={isMint}>
                        Mint
                    </Button>
                </HStack>
                <Separator marginY={4} />

                <Text fontSize={"sm"} marginBottom={2}>Get USDV on Solana</Text>
                <HStack>
                    <Input type="number" placeholder="Amount" value={transferAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransferAmount(e.target.value)} />
                    <Button onClick={transferUSDV} bgColor={"blue.500"} loading={isTransfer} >
                        Transfer
                    </Button>
                </HStack>
                <Text textAlign={"center"} color={"blue.400"} marginTop={2} fontSize={"sm"}>{loadingText}</Text>
            </Card.Body>
        </Card.Root>
    )
}