const { Node, MemoryAccount, Universal } = require('@aeternity/aepp-sdk')
const { network } = require('../config')
const { url, internalUrl, networkId } = network.dev

module.exports = async (secretKey, publicKey) => {
    return new Promise(async (resolve, reject) => {
        const node = await Node({ url, internalUrl })
        const account = MemoryAccount({ keypair: { secretKey: secretKey, publicKey: publicKey } })
        const nodes = [{ name: networkId, instance: node }]
        const sdkInstance = await Universal({
            nodes,
            accounts: [account]
        })
        resolve(sdkInstance)
    })
}

