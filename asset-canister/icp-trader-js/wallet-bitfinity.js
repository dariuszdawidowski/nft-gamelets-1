/**
 * Wallet Bitfinity
 */

class WalletBitfinity {

    /**
     * Constructor
     */

    constructor(args = {}) {

        // Is installed?
        this.installed = window?.ic?.infinityWallet;

        // Is Connected?
        this.connected = false;

        // Public key
        this.address = {
            publicKey: null
        }

        // Callbacks
        this.onConnect = 'onConnect' in args ? args.onConnect : null;

    }

    /**
     * Connect
     */

    async connect() {
        const connection = await window.ic.infinityWallet.requestConnect();
        const principal = await window.ic.infinityWallet.getPrincipal();
        this.address.publicKey = principal.toString();
        this.connected = true;
        if (this.onConnect) this.onConnect();
    }

    /**
     * Autoconnect
     */

    async autoconnect() {

        if (this.installed) {
            this.connected = await window.ic.infinityWallet.isConnected();
            if (this.connected) {
                const principal = await window.ic.infinityWallet.getPrincipal();
                this.address.publicKey = principal.toString();
                this.connected = true;
                if (this.onConnect) this.onConnect();
            }
            else {
                this.connect();
            }
        }

    }

    /**
     * Sign given string
     * @param args.message
     * @return: {status: 'OK' | 'ERROR', signature: 'id of signed contract signature'}
     */

    async sign(args) {
        const message = new TextEncoder().encode(args.message);
        // const signature = await window.ic.plug.requestSignMessage({ message });
        const signature = '12345678';
        return {status: 'OK', signature};
    }

    /**
     * Make raw transaction
     * @param program: <string> program instruction name
     * @return {status: 'OK' | 'ERROR', signature: <string id of signed contract signature>}
     */

    async transaction(args) {

        if (this.installed && this.connected) {
        }

        // Fallback
        return {status: 'ERROR'};
    }

    /**
     * Request airdrop
     * @param args.amount: how many tokens to receive <Number>
     * @return: {status: 'OK' | 'ERROR', signature: 'id of signed contract signature'}
     */

    async airdrop(args) {

        if (this.installed && this.connected) {

        }

        // Fallback
        return {status: 'ERROR'};
    }

    /**
     * Transfer to another wallet from connected account
     * @param token: [string] - token symbol 'ICP' | custom
     * @param amount: <Number> - how much crypto
     * @param address: <string> - address of receiver
     * @return {status: 'OK' | 'ERROR'}
     */

    async transfer(args) {

        if (this.installed && this.connected) {

            const { token = 'ICP', amount = 0, address = null } = args;
            const TRANSFER_ICP_TX = {
                idl: idlFactory,
                canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
                methodName: 'send_dfx',
                args: [
                    {
                        //to: AccountIdentifier.fromPrincipal(Principal.from('qvteh-h3sj3-5xhzd-tuexk-wkm2u-ahnvz-xs6xg-onqn3-zhpbn-xpcss-zqe')).toHex(),
                        to: 'cc39f90e717d3b781b6f1cf057f3c9de9cf7655ab7c372a4ff97be00928f523d',
                        fee: { e8s: 10000n },
                        amount: { e8s: 1000000n },
                        memo: 1n,
                        from_subaccount: [],
                        created_at_time: [],
                    },
                ],
                onSuccess: async (res) => {
                    console.log('transferred icp successfully');
                    return {status: 'OK'};
                },
                onFail: (res) => {
                    console.log('transfer icp error', res);
                    return {status: 'ERROR', message: res};
                },
            };

            await window.ic.infinityWallet.batchTransactions([TRANSFER_ICP_TX], { host: undefined });
    
        }

        // Fallback
        return {status: 'ERROR'};
    }

}
