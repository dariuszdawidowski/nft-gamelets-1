/**
 * Wallet Plug
 */

class WalletPlug extends Wallet {

    /**
     * Constructor
     */

    constructor() {
        super({ installed: window?.ic?.plug });
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
            if (host) connectArgs.host = host;
            let key = null;
            try {
                key = await window.ic.plug.requestConnect(connectArgs);
            }
            catch (e) {
                console.error(e);
                if (onFail) onFail(e);
            }

            if (key) {
                // Swap trader actor
                this.actor.swap = await window.ic.plug.createActor({ interfaceFactory: idlFactoryICPTrader, canisterId: traderCanisterId });

                // ICP ledger actor
                this.actor.icpledger = await window.ic.plug.createActor({ interfaceFactory: idlFactoryICPLedger, canisterId: this.ICP_LEDGER });

                // Conected
                this.connected = true;
                if (onConnected) onConnected('plug');
            }
        }

    }

    /**
     * Autoconnect
     */

    async autoconnect() {

        if (this.installed) {
            this.connected = await window.ic.plug.isConnected();
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
