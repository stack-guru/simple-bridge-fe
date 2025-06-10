import { Button, Box, Heading, Card, HStack, VStack, Center, Icon, Input, Field, Text, Separator } from "@chakra-ui/react"
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
import Solana from "./components/solana"

function App() {
  const { connected } = useWallet()

  return (
    <Box paddingTop={8}>
      <Toaster />
      <Heading size={"4xl"} textAlign={"center"}>Bridge Testing!</Heading>
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
        <Solana />
      </HStack>
    </Box>
  )
}

export default App
