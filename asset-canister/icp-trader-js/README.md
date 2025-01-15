ICP TRADER JavaScript interface
v0.5.1

Include scripts:
```html
    <script src="icp-trader-js/autodetect.js"></script>
    <script src="icp-trader-js/icp-ledger.did.js"></script>
    <script src="icp-trader-js/icp-trader.did.js"></script>
    <!--script src="icp-trader-js/wallet-bitfinity.js"></script--> TODO
    <script src="icp-trader-js/wallet-plug.js"></script>
```

Init:
```js
    const wallet = autodetectWallet({
        onNotInstalled: () => {
            console.log('Message encouraging the user to install the wallet');
        },
        onInstalled: () => {
            console.log('Message encouraging the user to connect the wallet');
        },
        onConnected: () => {
            console.log('Wallet is connected and ready to transactions');
        },
    });
```

Connect button:
```js
    document.getElementById('#button-connect').addEventListener('click' () => {
        wallet.connect({ traderCanisterId: '...' });
    });
```

Perform swap:
```js
    wallet.swap({
        // id of the Token 'canisterID' or NFT 'collectionID:nftID' to buy
        token: 'canisterID',
        // amount to buy
        amount: 10_00000000,
        onOrder: () => {
            console.log('Step #1: Requesting order');
        },
        onTransfer: () => {
            console.log('Step #2: Transfering ICP');
        },
        onClaim: () => {
            console.log('Step #3: Claiming bought assets');
        },
        onFinish: () => {
            console.log('Success');
        },
        onFail: () => {
            console.log('Failed');
        },
    });
```
