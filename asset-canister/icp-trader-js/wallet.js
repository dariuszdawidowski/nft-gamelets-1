/**
 * Base Wallet class
 */

class Wallet {

    /**
     * Constructor
     * @param args.onConnected: <function> - callback when connected
     * @param args.installed: <boolean> - is wallet installed
     * Actors filled by subclass
     */

    constructor(args = {}) {

        // Is installed?
        this.installed = args.installed;

        // Is Connected?
        this.connected = false;

        // Actors
        this.actor = {
            icpledger: null,
            icrc37ledger: null,
            swap: null,
        };

        // Callback when successfully connected
        this.onConnected = ('onConnected' in args) ? args.onConnected : null;

        // Ledger canister ID
        this.ICP_LEDGER = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
    }

    /**
     * Transfer to another wallet from connected account
     * @param tokenId: <string> - id of the Token 'canisterID' or NFT 'collectionID:nftID'
     * @param tokenType: <string> - 'ICRC-1' or 'ICRC-7'
     * @param amount: <Number> - amount of assets to buy
     * @param onOrder: callback
     * @param onTransfer: callback
     * @param onClaim: callback
     * @param onFinish: callback
     * @param onFail: callback
     * @return {status: 'OK' | 'ERROR'}
     */

    async swap(args) {

        const onOrder = ('onOrder' in args) ? args.onOrder : null;
        const onTransfer = ('onTransfer' in args) ? args.onTransfer : null;
        const onClaim = ('onClaim' in args) ? args.onClaim : null;
        const onFinish = ('onFinish' in args) ? args.onFinish : null;
        const onFail = ('onFail' in args) ? args.onFail : null;

        if (this.installed && this.connected) {
    
            // 1. Place an order
            if (onOrder) onOrder();
            const order = await this.actor.swap.order({
                tokenFrom: this.ICP_LEDGER,
                typeFrom: 'ICRC-1',
                tokenTo: args.tokenId,
                typeTo: args.tokenType,
                amount: args.amount
            });
            console.log('order', order);

            if ('ok' in order) {

                // 2. Send ICP to swap account
                if (onTransfer) onTransfer();
                let transfer = null;
                try {
                    transfer = await this.actor.icpledger.transfer({
                        to: this.hexToUint8Array(order.ok.accountId),
                        amount: { e8s: order.ok.cost },
                        memo: order.ok.orderId,
                        fee: { e8s: BigInt(10000) },
                        from_subaccount: [],
                        created_at_time: [],
                    });
                }
                catch(err) {
                    if (onFail) onFail();
                    return {status: 'ERROR'};
                }
                console.log('transfer', transfer);

                if ('Ok' in transfer) {

                    // Wait for indexing operation
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // 3. Claim tokens
                    if (onClaim) onClaim();
                    const claim = await this.actor.swap.claim({
                        tokenFrom: this.ICP_LEDGER,
                        typeFrom: 'ICRC-1',
                        tokenTo: args.tokenId,
                        typeTo: args.tokenType,
                        amount: args.amount,
                        memo: order.ok.orderId
                    });
                    console.log('claim', claim);

                    if ('ok' in claim) {
                        if (onFinish) onFinish();
                    }

                    // Claim errors
                    else if ('err' in claim) {
                        if (onFail) onFail();
                        let error = 'unknown';
                        if ('General' in claim.err) error = `Generic error`;
                        else if ('OrderNotFound' in claim.err) error = `Order not found`;
                        else if ('TransferNotFound' in claim.err) error = `Didn't transfer ICP`;
                        else if ('TransferClaim' in claim.err) error = `Problem with transfering tokens to claimer`;
                        alert(error);
                    }

                }

                // Transfer errors
                else if ('Err' in transfer) {
                    if (onFail) onFail();
                    let error = 'unknown';
                    if ('GenericError' in transfer.Err) error = `Generic error`;
                    else if ('TemporarilyUnavailable' in transfer.Err) error = `Temporarily unavailable`;
                    else if ('BadBurn' in transfer.Err) error = `Bad burn`;
                    else if ('Duplicate' in transfer.Err) error = `Duplicate transfer`;
                    else if ('BadFee' in transfer.Err) error = `Bad fee`;
                    else if ('CreatedInFuture' in transfer.Err) error = `The creation date is in the future`;
                    else if ('TooOld' in transfer.Err) error = `The transaction has expired`;
                    else if ('InsufficientFunds' in transfer.Err) error = `Insufficient funds in your wallet`;
                    alert(error);
                }

            }

            // Order errors
            else if ('err' in order) {
                if (onFail) onFail();
                let error = 'unknown';
                if ('General' in order.err) error = 'Generic error';
                else if ('PoolNotExist' in order.err) error = 'Pool does not exist';
                else if ('TokenNotListed' in order.err) error = 'Token not listed';
                else if ('PoolNotEnoughTokens' in order.err) error = 'Not enough tokens in our pool';
                else if ('Reserved' in order.err) error = 'Token reserved. Someone is buying it. If it was your failed operation - wait a while and try again.';
                alert(error);
            }

        }

        return {status: 'OK'};
    }

    /**
     * Fetch info about ICRC-7 NFTs
     * @param owned: [id, ...] - fetch list of owned NFTs
     * @param cycles: Number - fetch cycles in the NFT collection canister
     */

    async infoNFTs({ owned = false, cycles = false }) {
        let info = {};

        // Principal ID
        const principal = await this.getPrincipal();
        info.principalId = principal.toString();

        // Information about owned NFTs
        if (owned) info.owned = await this.actor.icrc37ledger.icrc7_tokens_of({ owner: principal, subaccount: [] }, [], []);

        // Information about cycles in the canister
        if (cycles) info.cycles = await this.actor.icrc37ledger.get_cycles();

        return info;
    }

    /**
     * Utils
     */

    hexToUint8Array(hex) {
        if (hex.length % 2 !== 0) {
            throw new Error('Invalid hex string length');
        }
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes;
    }

}
