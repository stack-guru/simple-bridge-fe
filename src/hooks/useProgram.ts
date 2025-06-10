import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react"
import { AnchorProvider, setProvider, Program } from "@coral-xyz/anchor"
import { SOLANA_ADDRESS } from "@/utils/constants"
import { IDL } from "@/assets/idl"

const useProgram = () => {
    const anchorWallet = useAnchorWallet()
    const { connection } = useConnection()
    const provider = new AnchorProvider(connection, anchorWallet!, {})
    setProvider(provider)
    const program = new Program(IDL, SOLANA_ADDRESS)

    return { program, connection, anchorWallet }
}

export default useProgram