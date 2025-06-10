import { useState } from "react"
import { Card, Button, Input, Text } from "@chakra-ui/react"
import useProgram from "@/hooks/useProgram"
import { burnAndSend } from "@/utils/solana"
import { toaster } from "@/components/ui/toaster"

export default function Solana() {
    const [redeemAmount, setRedeemAmount] = useState("")
    const { program, connection, anchorWallet } = useProgram()

    const redeemToken = async () => {
        console.log('redeem token')
        try {
            burnAndSend(program, redeemAmount, connection, anchorWallet!)
        } catch (err) {
            console.log('burn and send err: ', err)
            toaster.create({
                description: "Failed :(",
                type: "error"
            })
        }
    }

    return (
        <Card.Root width={"540px"}>
            <Card.Header>
                <Card.Title mb="2">Redeem USDV on Solana</Card.Title>
            </Card.Header>
            <Card.Body>
                <Text fontSize={"sm"} marginBottom={2}>USDV{`->`}USDT</Text>
                <Input type="number" placeholder="Amount" value={redeemAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRedeemAmount(e.target.value)} />
                <Button marginTop={4} onClick={redeemToken}>Redeem</Button>
            </Card.Body>
        </Card.Root>
    )
}