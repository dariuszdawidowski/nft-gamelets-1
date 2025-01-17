#!/bin/bash

# NFT Manage script

function help () {
    echo "Usage:"
    echo "  ./manage.sh <option> [param]"
    echo "  Options:"
    echo "    deploy <canister> [--ic] - deploy canister"
    echo "    mint <nft id> <html url> <thumbnail url> [--ic] - mint NFT"
    echo "    transfer <nft id> <to principal> [--ic] - transfer NFT to new owner"
    echo "    batch [--ic] - mint all collection and transfer to trader"
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

    dfx deploy minter --argument 'record {icrc7_args = null; icrc37_args = null; icrc3_args = null;}' --mode reinstall $3
    dfx canister call minter init $3
    dfx canister call minter icrc7_name --query $3
    
    exit 0
fi

if [ $1 == "mint" ]; then
    echo "Minting NFT id=$2 experience=$3 thumbnail=$4..."

    dfx canister call minter icrcX_mint "(
      vec {
        record {
            token_id = $2 : nat;
            owner = opt record { owner = principal \"$MINTER_CANISTER\"; subaccount = null;};
            metadata = variant {
                Class = vec {
                    record {
                        value = variant {
                            Text = \"$4\"
                        };
                        name = \"icrc7:metadata:uri:preview\";
                        immutable = true;
                    };
                    record {
                        value = variant {
                            Text = \"$3\"
                        };
                        name = \"icrc7:metadata:uri:experience\";
                        immutable = true;
                    };
                }
            };
            memo = opt blob \"\00\01\";
            override = true;
            created_at_time = null;
        };
      },
    )" $5

    dfx canister call minter icrc7_total_supply --query $5
    
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

if [ $1 == "batch" ]; then
    echo "Batching all mint & transfer to trader..."

    if [ "$2" == "--ic" ]; then
        for i in {1..21}
        do
            echo "Minting NFT $i @ IC"
            ./manage.sh mint $i https://4smx4-eqaaa-aaaap-ahxlq-cai.icp0.io/nft/$i.html https://4smx4-eqaaa-aaaap-ahxlq-cai.icp0.io/nft/$i-thumb.png --ic
            echo "Transferring NFT $i to trader @ IC"
            ./manage.sh transfer $i 2f7hj-diaaa-aaaah-qpxia-cai --ic
        done
    else
        for i in {1..21}
        do
            echo "Minting NFT $i"
            ./manage.sh mint $i http://bw4dl-smaaa-aaaaa-qaacq-cai.localhost:8080/nft/$i.html http://bw4dl-smaaa-aaaaa-qaacq-cai.localhost:8080/nft/$i-thumb.png
            echo "Transferring NFT $i to trader"
            ./manage.sh transfer $i be2us-64aaa-aaaaa-qaabq-cai
        done
    fi

    exit 0
fi

echo "Syntax error"
help
exit 1
