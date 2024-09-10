#!/bin/bash

# Pixelpunk Gamelets #1
# v0.4.1

function help () {
    echo "Usage:"
    echo "  ./manage.sh <option> [param]"
    echo "  Options:"
    echo "    deploy <canister> [--ic] - deploy canister"
    echo "    mint <nft id> <asset url> [--ic] - mint collection"
    echo "    transfer <nft id> <to principal> [--ic] - transfer NFT to new owner"
    exit 0
}

if [ $# == 0 ] || [ $1 == 'help' ] ; then
    help
    exit 0
fi

export MINTER_CANISTER=$(dfx canister id minter)

if [ $1 == "deploy" ] && [ $2 == "assets" ]; then
    echo "Installing Asset canister..."

    dfx deploy assets $3
    
    exit 0
fi

if [ $1 == "deploy" ] && [ $2 == "minter" ]; then
    echo "Installing Minter canister and initialize collection..."

    dfx deploy minter --argument 'record {icrc7_args = null; icrc37_args =null; icrc3_args =null;}' --mode reinstall $3
    dfx canister call minter init $3
    dfx canister call minter icrc7_name --query $3
    
    exit 0
fi

if [ $1 == "mint" ]; then
    echo "Minting NFT id $2 url $3..."

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
    )" $4

    dfx canister call minter icrc7_total_supply --query $4
    
    exit 0
fi

if [ $1 == "transfer" ]; then
    echo "Transfering NFT id $2 from $MINTER_CANISTER to $3..."

    dfx canister call minter icrc37_transfer_from "(vec{record {
        spender = principal \"$3\";
        from = record { owner = principal \"$MINTER_CANISTER\"; subaccount = null};
        to = record { owner = principal \"$3\"; subaccount = null};
        token_id = $2 : nat;
        memo = null;
        created_at_time = null;}})" $4

    dfx canister call minter icrc7_owner_of "(vec {$2})" --query $4

    exit 0
fi

echo "Syntax error"
help
exit 1
