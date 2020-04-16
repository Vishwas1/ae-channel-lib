const { CH, ROLE } = require('../src/channels')
const { network } =  require('../config')
const keys = require('../keys.json')


const CH_URL =  network.dev.channelUrl
const buyerCh = new CH(
    CH_URL, 
    ROLE.INITIATOR, 
    keys.buyer, 
    keys.seller.publicKey,
    0.005e18,
    0.005e18,
    0,
    'localhost',
    3333
    );
buyerCh.open();
