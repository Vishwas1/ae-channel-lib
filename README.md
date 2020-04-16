

## Usage

```
const { CH, ROLE } = require('./channel')
const keys = require('../keys.json')


const CH_URL =  'ws://localhost:3001/channel'
const channel = new CH(CH_URL, ROLE.INITIATOR, keys.buyer, keys.seller.publicKey);
channel.open();
```


## References:

- https://github.com/aeternity/aepp-sdk-js/blob/develop/docs/api/channel/index.md
- https://github.com/aeternity/aepp-sdk-js/blob/develop/test/integration/channel.js
- https://github.com/u2467/pay-per-frame
- https://github.com/aeternity/ae-channel-service/
- https://github.com/aeternity/protocol/blob/master/node/api/examples/channels/json-rpc/continuous/init_per_group.md
- https://aeternity.com/documentation-hub/protocol/channels/
- https://github.com/aeternity/aepp-sdk-js/blob/develop/test/integration/channel.js
- https://github.com/aeternity/protocol/blob/master/node/api/examples/channels/json-rpc/sc_ws_basic_open_close.md

