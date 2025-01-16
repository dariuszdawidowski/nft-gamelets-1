/**
 * Wallet Bitfinity
 */

class WalletBitfinity extends Wallet {

    /**
     * Constructor
     */

    constructor(args = {}) {
        super({ ...args, installed: window?.ic?.infinityWallet });
    }

    /**
     * Connect
     */

    async connect({ traderCanisterId, host = null } = {}) {

        if (this.installed) {

            // Connect to wallet
            const connectArgs = {
                whitelist: [this.ICP_LEDGER, traderCanisterId],
                timeout: 50000
            };
            try {
                const key = await window.ic.infinityWallet.requestConnect(connectArgs);
            }
            catch (e) {
                console.error(e);
            }

            if (key) {
                // Swap trader actor
                this.actor.swap = await window.ic.infinityWallet.createActor({ interfaceFactory: idlFactoryICPTrader, canisterId: traderCanisterId, host });

                // ICP ledger actor
                this.actor.icpledger = await window.ic.infinityWallet.createActor({ interfaceFactory: idlFactoryICPLedger, canisterId: this.ICP_LEDGER, host });

                // Conected
                this.connected = true;
                if (this.onConnected) this.onConnected();
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
