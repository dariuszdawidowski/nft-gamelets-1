#!/bin/bash

# Pixelpunk Gamelets #1
# v0.2.0

# export OWNER=$(dfx identity get-principal)
# export ASSET_CANISTER=$(dfx canister id assets)
export MINTER_CANISTER=$(dfx canister id minter)

function help () {
    echo "Usage:"
    echo "  ./manage.sh <option> [param]"
    echo "  Options:"
    echo "  deploy <canister> [--ic] - deploy canister to a local replica or mainnet with --ic"
    echo "  mint <nft id> <asset url> [--ic] - mint collection on a local replica or mainnet with --ic"
}

if [ $# == 0 ]; then
    help
    exit 0
fi

if [ $1 == "deploy" ] && [ $2 == "assets" ]; then
    echo "Installing Asset canister on a local replica..."

    dfx deploy assets
    
    exit 0
fi

if [ $1 == "deploy" ] && [ $2 == "minter" ]; then
    echo "Installing Minter canister and initialize collection..."

    dfx deploy minter --argument 'record {icrc7_args = null; icrc37_args =null; icrc3_args =null;}' --mode reinstall
    dfx canister call minter init
    dfx canister call minter icrc7_name --query
    
    exit 0
fi

if [ $1 == "mint" ]; then
    echo "Minting NFT $2 @ $3..."

    dfx canister call minter icrcX_mint "(
      vec {
        record {
            token_id = $2 : nat;
            owner = opt record { owner = principal \"$MINTER_CANISTER\"; subaccount = null;};
            metadata = variant {
                Class = vec {
                    record {
                         value = variant {
                            Text = \"$3\"
                        };
                        name = \"icrc7:metadata:uri:image\";
                        immutable = true;
                    };
                }
            };
            memo = opt blob \"\00\01\";
            override = true;
            created_at_time = null;
        };
      },
    )"

    dfx canister call minter icrc7_total_supply --query
    
    exit 0
fi

echo "Syntax error"
help
exit 1
