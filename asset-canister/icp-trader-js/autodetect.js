/**
 * Wallet Detector
 * v 0.2.1
 */

function autodetectWallet(args) {

    if (window.location.protocol == 'file:') console.error('Wallets require a server to work');

    // Plug Wallet
    if (window?.ic?.plug) {
        if ('onInstalled' in args) args.onInstalled();
        return new WalletPlug(args);
    }

    // Bitfinity Wallet
    // if (window?.ic?.infinityWallet) {
    //     if ('onInstalled' in args) args.onInstalled();
    //     return new WalletBitfinity(args);
    // }

    // Not installed
    if ('onNotInstalled' in args) args.onNotInstalled();

    return null;
}