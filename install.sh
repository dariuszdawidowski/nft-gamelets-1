#!/bin/bash

for i in {1..21}
do
    ./manage.sh mint $i https://4smx4-eqaaa-aaaap-ahxlq-cai.icp0.io/nft/$i.html https://4smx4-eqaaa-aaaap-ahxlq-cai.icp0.io/nft/$i-thumb.png --ic
    ./manage.sh transfer $i 2f7hj-diaaa-aaaah-qpxia-cai --ic
done
