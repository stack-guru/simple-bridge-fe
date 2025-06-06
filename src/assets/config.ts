import { http, createConfig } from '@wagmi/core'
import { polygon, polygonAmoy } from '@wagmi/core/chains'

export const config = createConfig({
    chains: [polygon, polygonAmoy],
    transports: {
        [polygon.id]: http(),
        [polygonAmoy.id]: http(),
    },
})