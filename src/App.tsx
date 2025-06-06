import { Button, Box, Heading, Card, HStack, VStack, Center, Icon, Input, Field, Text, Separator } from "@chakra-ui/react"
import { useAccount, useWriteContract } from 'wagmi'
import { useWallet } from "@solana/wallet-adapter-react"
import { Toaster, toaster } from "@/components/ui/toaster"
import {
  WalletModalProvider,
  WalletModalButton,
  WalletDisconnectButton
} from "@solana/wallet-adapter-react-ui"
import "@solana/wallet-adapter-react-ui/styles.css"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Polygon from "./components/polygon"

function App() {
  const { connected, publicKey } = useWallet()
  const account = useAccount()
  const { writeContract } = useWriteContract()

  return (
    <Box>
      <Toaster />
      <Heading marginTop={8} size={"4xl"} textAlign={"center"}>Bridge Testing!</Heading>
      <Box marginTop={8} display={"flex"} justifyContent={"center"}>
        <VStack>
          <Box textAlign={"center"}>
            <Text fontSize={"sm"}>Solana</Text>
            <WalletModalProvider>
              <Center gap={"8px"}>
                {
                  connected ?
                    <WalletDisconnectButton />
                    :
                    <WalletModalButton />
                }
              </Center>
            </WalletModalProvider>
          </Box>
          <Box textAlign={"center"}>
            <Text fontSize={"sm"}>Polygon</Text>
            <ConnectButton />
          </Box>
        </VStack>
      </Box>
      <HStack align={"center"} width={"full"} justifyContent={"center"} gap={8} marginTop={8}>
        <Polygon />

        <Card.Root width={"540px"}>
          <Card.Header>
            <Card.Title mb="2">Redeem USDV on Solana</Card.Title>
          </Card.Header>
          <Card.Body>
            {/* <Field.Root>
              <Field.Label>
                Polygon Address <Field.RequiredIndicator />
              </Field.Label>
              <Input placeholder="Polygon Address" readOnly value={account.isConnected ? account.address : ""} />
              <Field.HelperText>Polygon Address</Field.HelperText>
            </Field.Root> */}
          </Card.Body>
          <Card.Footer justifyContent={"center"}>
            <Button marginTop={4}>Redeem</Button>
          </Card.Footer>
        </Card.Root>
      </HStack>
    </Box>
  )
}

export default App
