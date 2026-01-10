$MAINNET_RPC_URL --broadcast --verify -vvvv 

forge script script/Reward.s.sol:RewardScript --rpc-url $MANTLE_SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify --etherscan-api-key $ETHERSCAN_API_KEY

forge script script/LOTStaking.s.sol:LOTStakingScript --rpc-url $MAINNET_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify --etherscan-api-key $ETHERSCAN_API_KEY
forge script script/LOTStaking.s.sol:LOTStakingScript --rpc-url $MAINNET_RPC_URL --private-key $PRIVATE_KEY 


   forge script script/LyricToken.s.sol:LyricTokenScript   --rpc-url $STORY_RPC_URL   --private-key $PRIVATE_KEY   --broadcast   --verify   --verifier blockscout   --verifier-url https://aeneid.storyscan.io/api/

  forge script script/SongNFT.s.sol:SongNFTScript   --rpc-url $STORY_RPC_URL   --private-key $PRIVATE_KEY   --broadcast   --verify   --verifier blockscout   --verifier-url https://aeneid.storyscan.io/api/

 forge script script/DerivativeFactory.s.sol:DerivativeFactoryScript   --rpc-url $STORY_RPC_URL   --private-key $PRIVATE_KEY   --broadcast   --verify   --verifier blockscout   --verifier-url https://aeneid.storyscan.io/api/


