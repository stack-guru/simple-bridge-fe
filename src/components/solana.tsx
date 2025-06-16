import { useState } from "react"
import { Card, Button, Input, Text } from "@chakra-ui/react"
import useProgram from "@/hooks/useProgram"
import { useWriteContract, usePublicClient } from 'wagmi'
import { burnAndSend, getSolanaVaa } from "@/utils/solana"
import { toaster } from "@/components/ui/toaster"
import { abi } from "@/assets/abi"
import { POLYGON_ADDRESS } from "@/utils/constants"

export default function Solana() {
    const [redeemAmount, setRedeemAmount] = useState("")
    const { program, connection, anchorWallet } = useProgram()
    const [isRedeem, setIsRedeem] = useState(false)
    const pClient = usePublicClient()
    const { writeContractAsync } = useWriteContract()

    const redeemToken = async () => {
        if (!redeemAmount) {
            toaster.create({
                description: "Please input redeem amount",
                type: "error"
            })

            return
        }

        setIsRedeem(true)
        try {
            const trx = await burnAndSend(program, redeemAmount, connection, anchorWallet!)
            const vaa = await getSolanaVaa(trx)
            if (vaa) {
                const received = await writeContractAsync({
                    abi,
                    address: POLYGON_ADDRESS,
                    functionName: "receiveAndRedeem",
                    args: [
                        vaa
                    ]
                })
                const receipt = await pClient?.waitForTransactionReceipt({ hash: received })
                if (receipt?.status === "success") {
                    toaster.create({
                        description: "Redeemed!",
                        type: "success"
                    })
                } else {
                    toaster.create({
                        description: "Failed :(",
                        type: "error"
                    })
                }
            }
        } catch (err) {
            console.log('burn and send err: ', err)
            toaster.create({
                description: "Failed :(",
                type: "error"
            })
        }
        setIsRedeem(false)
    }

    return (
        <Card.Root width={"full"} md={{ width: "540px" }}>
            <Card.Header>
                <Card.Title mb="2">Redeem USDV on Solana</Card.Title>
            </Card.Header>
            <Card.Body>
                <Text fontSize={"sm"} marginBottom={2}>USDV{`->`}USDT</Text>
                <Input type="number" placeholder="Amount" value={redeemAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRedeemAmount(e.target.value)} />
                <Button marginTop={4} onClick={redeemToken} loading={isRedeem} bgColor={"blue.500"}>Redeem</Button>
            </Card.Body>
        </Card.Root>
    )
}