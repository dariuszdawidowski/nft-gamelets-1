ICP TRADER JavaScript interface
v0.6.0

Include scripts:
```html
    <script src="icp-trader-js/autodetect.js"></script>
    <script src="icp-trader-js/icp-ledger.did.js"></script>
    <script src="icp-trader-js/icp-trader.did.js"></script>
    <script src="icp-trader-js/wallet.js"></script>
    <script src="icp-trader-js/wallet-bitfinity.js"></script>
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
        // Local replica address: wallet.connect({ traderCanisterId: '...', host: 'http://127.0.0.1:8080' });
    });
```

Perform swap:
```js
    wallet.swap({
        // Canister id of the Token 'canisterID' or NFT 'collectionID:nftID' to buy
        tokenId: 'canisterID',
        // Type of the token to buy 'ICRC-1' | 'ICRC-7'
        tokenType: 'ICRC-1',
        // amount to buy
        amount: 10_0000_0000,
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
