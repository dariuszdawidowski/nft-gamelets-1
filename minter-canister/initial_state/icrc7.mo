import ICRC7 "mo:icrc7-mo";

module{
  public let defaultConfig = func(caller: Principal) : ICRC7.InitArgs{
      ?{
        symbol = ?"NBL";
        name = ?"Pixelpunk Gamelets #1";
        description = ?"A Collection of interactive micro-game NFTs";
        logo = ?"http://bw4dl-smaaa-aaaaa-qaacq-cai.localhost:8080/nft/c6d1ee1a-8708-439e-bf9a-05f727ee1319.png";
        supply_cap = null;
        allow_transfers = null;
        max_query_batch_size = ?100;
        max_update_batch_size = ?100;
        default_take_value = ?1000;
        max_take_value = ?10000;
        max_memo_size = ?512;
        permitted_drift = null;
        tx_window = null;
        burn_account = null; //burned nfts are deleted
        deployer = caller;
        supported_standards = null;
      };
  };
};