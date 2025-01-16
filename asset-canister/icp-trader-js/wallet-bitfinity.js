/**
 * Wallet Bitfinity
 */

class WalletBitfinity extends Wallet {

    /**
     * Constructor
     */

    constructor() {
        super({ installed: window?.ic?.infinityWallet });
    }

    /**
     * Connect
     */

    async connect({ traderCanisterId, host = null, onConnected, onFail } = {}) {

        if (this.installed) {

            // Connect to wallet
            const connectArgs = {
                whitelist: [this.ICP_LEDGER, traderCanisterId],
                timeout: 50000
            };
            let key = null;
            try {
                key = await window.ic.infinityWallet.requestConnect(connectArgs);
            }
            catch (e) {
                console.error(e);
                if (onFail) onFail(e);
            }

            if (key) {

                // Swap trader actor
                this.actor.swap = await window.ic.infinityWallet.createActor({ interfaceFactory: idlFactoryICPTrader, canisterId: traderCanisterId, host });

                // ICP ledger actor
                this.actor.icpledger = await window.ic.infinityWallet.createActor({ interfaceFactory: idlFactoryICPLedger, canisterId: this.ICP_LEDGER, host });

                // Conected
                this.connected = true;
                if (onConnected) onConnected('bitfinity');
            }
        }

    }

    /**
     * Autoconnect
     */

    async autoconnect() {

        if (this.installed) {
            this.connected = await window.ic.infinityWallet.isConnected();
            if (this.connected) {
                this.connected = true;
                if (this.onConnected) this.onConnected();
            }
            else {
                this.connect();
            }
        }

    }

}
