/**
 * Wallet Plug
 */

class WalletPlug extends Wallet {

    /**
     * Constructor
     */

    constructor(args = {}) {
        super({ ...args, installed: window?.ic?.plug });
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
            if (host) connectArgs.host = host;
            try {
                const key = await window.ic.plug.requestConnect(connectArgs);
            }
            catch (e) {
                console.error(e);
            }

            if (key) {
                // Swap trader actor
                this.actor.swap = await window.ic.plug.createActor({ interfaceFactory: idlFactoryICPTrader, canisterId: traderCanisterId });

                // ICP ledger actor
                this.actor.icpledger = await window.ic.plug.createActor({ interfaceFactory: idlFactoryICPLedger, canisterId: this.ICP_LEDGER });

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
