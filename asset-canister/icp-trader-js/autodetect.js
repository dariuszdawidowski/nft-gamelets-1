/**
 * Wallet Detector
 */

function autodetectWallet(args) {

    if (window.location.protocol == 'file:') {
        console.error('Wallets require a server to work');
        return null;
    }

    // Bitfinity Wallet
    if (window?.ic?.infinityWallet) {
        if ('onInstalled' in args) args.onInstalled();
        return new WalletBitfinity();
    }

    // Plug Wallet
    else if (window?.ic?.plug) {
        if ('onInstalled' in args) args.onInstalled();
        return new WalletPlug();
    }

    // Not installed
    if ('onNotInstalled' in args) args.onNotInstalled();

    return null;
}