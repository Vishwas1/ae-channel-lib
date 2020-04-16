module.exports = {
    network: {
        dev: {
            url: process.env.TEST_URL || 'http://localhost:3001',
            internalUrl: process.env.TEST_INTERNAL_URL || 'http://localhost:3001',
            channelUrl: process.env.CHANNEL_URL || 'ws://localhost:3001/channel',
            compilerUrl: process.env.COMPILER_URL || '',
            networkId: 'ae_devnet'
        },
        test: {
            url: process.env.TEST_URL || 'https://sdk-testnet.aepps.com',
            internalUrl: process.env.TEST_INTERNAL_URL || 'https://sdk-testnet.aepps.com',
            channelUrl: process.env.CHANNEL_URL || 'ws://sdk-testnet.aepps.com/channel',
            compilerUrl: process.env.COMPILER_URL || 'https://compiler.aepps.com',
            networkId: 'testnet-node'
        },
        prod: {

        }
    }
}