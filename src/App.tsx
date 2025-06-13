import { Box, Heading, HStack, VStack, Center, Text, Separator, Icon, Span, Link } from "@chakra-ui/react"
import { MdInfo } from "react-icons/md"
import { useWallet } from "@solana/wallet-adapter-react"
import { Toaster } from "@/components/ui/toaster"
import {
  WalletModalProvider,
  WalletModalButton,
  WalletDisconnectButton
} from "@solana/wallet-adapter-react-ui"
import "@solana/wallet-adapter-react-ui/styles.css"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Polygon from "./components/polygon"
import Solana from "./components/solana"
// import { transferUSDT } from "./utils/solana"

function App() {
  const { connected } = useWallet()

  // const testTransfer = async () => {
  //   await transferUSDT()
  // }

  return (
    <Box paddingTop={8} paddingX={16}>
      <Toaster />
      <Heading size={"4xl"} textAlign={"center"}>Bridge Testing!</Heading>
      <Box marginTop={4} display={"flex"} justifyContent={"center"}>
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
      <Separator marginY={4} />
      <Box textAlign={"center"}>
        <Icon color={"cyan.400"} size={"lg"}>
          <MdInfo />
        </Icon>
        <Text><Span color={"cyan.300"}>0x205De93CDED7bA4384Df6F17E6225f928163b8E6</Span>  is Test USDV Token on Amoy(Polygon test network)</Text>
        <Text><Span color={"cyan.300"}>0x89810c79c774d7Cd2e6e3305957Cc2e8C408C8Ad</Span>  is Test USDT Token on Amoy(Polygon test network)</Text>
        <Text><Span color={"cyan.300"}>Dkz4WrqjhmgqQjHaZb5q26hh79JkgMApS2i8qaxi5PKt</Span>  is Test USDV Token on Solana</Text>
        <Text color={"yellow.300"}>The Amoy network doesn't work well with MetaMask. Please use a different wallet, such as Rabby Wallet.</Text>
        {/* <Button marginTop={4} onClick={() => testTransfer()}>Transfer USDT</Button> */}
        <Text marginTop={4}>Please get Amoy test token from this site.  <Link color={"cyan.200"}>https://faucet.stakepool.dev.br/amoy</Link></Text>
        <Text>Please get Solana devenet Sol from this site.  <Link color={"cyan.200"}>https://faucet.solana.com/</Link></Text>
      </Box>
    </Box>
  )
}

export default App
