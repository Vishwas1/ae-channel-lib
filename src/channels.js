const { Channel } = require('@aeternity/aepp-sdk')
const account = require('./account')

let activeChannels = []
const ROLE = Object.freeze({
    INITIATOR: "initiator",
    RESPONDER: "responder"
})

function CH(
    channelUrl,
    role,
    initiatorKp,
    responderPk,
    initiatorAmount,
    responderAmount,
    channelReserve,
    responderHost,
    responderPort
    ) {

    this.channel = null;
    this.keypair = initiatorKp

    this.acc = async () => {
        return await account(this.keypair.secretKey, this.keypair.publicKey)
    }

    this.signTxCallBack = (tag, tx) => this.acc().signTransaction(tx)

    this.params = {
        url: channelUrl,
        pushAmount: 0,
        initiatorId: this.keypair.publicKey,
        responderId: responderPk,
        initiatorAmount: initiatorAmount,
        responderAmount: responderAmount,
        channelReserve: channelReserve,
        ttl: 100,
        host: responderHost,
        port: responderPort,
        lockPeriod: 10,
        minimumDepth: 0,
        role: role
    }

    if (role && role.RESPONDER) {
        delete this.params.host
        delete this.params.port
    }

    this.open = async () => {
        console.log('Trying to open the channel')
        const channel = await Channel({
            ...this.params,
            sign: this.signTxCallBack
        })

        channel.on('statusChanged', (status) => {
            console.log(`status = ${status}`);
            if (status === 'open') {
                console.log(`status = open`);
                activeChannels[channel.id()] = {
                    params: sharedParams,
                    channel: channel,
                }
                console.log(`Channel Id =  ${channel.id()}`)
                console.log(`Round = ${channel.round()}`) // 1      
            }
        });
        this.channel = channel
    }

    this.updateChannel = async (senderPk, receiverPk, amount) => {
        const meta = 'meta 1'
        const result = await this.channel.update(
            senderPk, //Sender's public address
            receiverPk, //Receiver's public address
            amount,
            this.signTxCallBack //async (tx) => await this.account.signTransaction(tx), //Function which verifies and signs offchain transaction
            [meta] // met
        )
        //{ accepted, signedTx }
        console.log(result.accepted)
        console.log(result.signedTx)
        console.log(`Round after ishwaupdate = ${this.channel.round()}`)
    }

    this.getBalances = async (address) => {
        return await this.channel.balances(address)
    }

    this.sendMessage = async (message, recipient) => {
        //Send generic message
        await this.channel.sendMessage(
            message,
            recipient
        )
        const result = await this.channel.on('message')
        console.log(result)
    }

    this.listeners = {
        //After the other party had signed the withdraw/deposite transaction, 
        //the transaction is posted on-chain and `onOnChainTx` callback is called with on-chain transaction as first argument.
        onOnChainTx: (on_chain_tx) => { },

        //After computing transaction hash it can be tracked on the chain: entering the mempool, block inclusion and a number of confirmations.
        //After the minimum_depth block confirmations onOwnWithdrawLocked callback is called
        onOwnWithdrawLocked: () => { },

        //After the minimum_depth block confirmations onOwnDepositLocked callback is called (without any arguments).
        onOwnDepositLocked: () => { },

        //When the other party had confirmed that the block height needed is reached onWithdrawLocked callback is called
        onWithdrawLocked: () => { },

        //When the other party had confirmed that the block height needed is reached onDepositLocked callback is called 
        onDepositLocked: () => { },

        error: () => { }
    }

    this.withDraw = async () => {
        //channel_withdraw_tx 
        //After the channel had been opened any of the participants can initiate a withdrawal.
        //The process closely resembles the update. The most notable difference is that the transaction has been co-signed

        const result = await this.channel.withdraw(
            amount,
            this.signTxCallBack,
            { onOnChainTx, onOwnWithdrawLocked, onWithdrawLocked } = listeners
        )

        const { accepted, signedTx } = result;
        console.log(`WITHDRAW: accepted = ${accepted}`)
        console.log(`WITHDRAW: signedTx = ${signedTx}`)
    }

    this.deposite = async () => {
        //channel_deposit_tx
        //After the channel had been opened any of the participants can initiate a deposit.

        const result = await this.channel.deposit(
            amount,
            this.signTxCallBack,
            { onOnChainTx, onOwnDepositLocked, onDepositLocked } = listeners
        )
        const { accepted, signedTx } = result;
        const { txType, tx } = TxBuilder.unpackTx(signedTx)
        console.log(`DEPOSITE: accepted = ${accepted}`)
        console.log(`DEPOSITE: txType = ${txType}`) //channelDeposit
        console.log(`DEPOSITE: tx = ${tx}`)

    }

    this.close = async () => {
        //Trigger mutual close
        //At any moment after the channel is opened, a closing procedure can be triggered.
        //This can be done by either of the parties

        const result = await this.channel.shutdown(sign)
        const { txType, tx } = TxBuilder.unpackTx(result)

        console.log(`CLOSE: txType = ${txType}`) //channelCloseMutual
        console.log(`CLOSE: tx = ${tx}`)

    }

    this.leave = async () => {
        //It is possible to leave a channel and 
        //then later reestablish the channel off-chain state and continue operation. When a leave method is called, 
        //the channel fsm passes it on to the peer fsm, reports the current mutually signed state and then terminates.
        //The channel can be reestablished by instantiating another Channel instance with two extra params: existingChannelId and offchainTx 
        //(returned from leave method as channelId and signedTx respectively).

        const result = await this.channel.leave();
        const { channelId, signedTx } = result;
        console.log(`LEAVE: offchainTx = ${signedTx}`)
        console.log(`LEAVE: channelId = ${channelId}`)

    }

    this.reconnect = async (existingChannelId, offchainTx) => {
        const channel = await Channel({
            ...this.params,
            role: 'initiator',
            port: 3002,
            [existingChannelIdKey]: existingChannelId,
            offchainTx,
            sign: this.signTxCallBack
        })

        const status = await channel.on('statusChanged');
        if (status === 'open') {
            console.log(`RE-CONNECT: channel [${existingChannelId} is reconnected]`)
        }
        this.channel = channel

    }
}

module.exports = {
    CH,
    ROLE
}

