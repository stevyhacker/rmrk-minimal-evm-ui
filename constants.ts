import abis from './abis/abis';

// MoonbaseAlpha deployments
// export const RMRKMultiResourceFactoryContractAddress = '0x8E1214B2eD8a8581D1f35f525d82E9077C2c7513';
// export const RMRKNestingFactoryContractAddress = '0x2a962fA5DD393507B2b1C527d2aa52EBC298f689';
// export const RMRKMarketplaceContractAddress = '0xbdf6DB34C85669DCf090781d43b8F5391DE38DEd';

// Goerli deployments
export const RMRKMultiResourceFactoryContractAddress = '0x1C4a82121F64Ad8F67774f5FE53571a7b8a84531';
export const RMRKNestingFactoryContractAddress = '0xb78a4BD9Fb46378054Ca294782d9650611e50C31';
export const RMRKMarketplaceContractAddress = '0x3151f12E6A8e1941278b636b2E3850d1eFE37A7E';

export const NATIVE_ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

//Moonscan MR https://moonbase.moonscan.io/address/0xB77520a5D97CAF7DEBC5AF7A28C19c49F063B4A5
//Moonscan Nesting https://moonbase.moonscan.io/address/0xd0c004801Af669857Bf0241235b7cBC3897F5932

export const multiResourceFactoryContractDetails = {
  addressOrName: RMRKMultiResourceFactoryContractAddress,
  contractInterface: abis.multiResourceFactoryAbi,
};

export const nestingFactoryContractDetails = {
  addressOrName: RMRKNestingFactoryContractAddress,
  contractInterface: abis.nestingFactoryAbi,
};

export const marketplaceContractDetails = {
  addressOrName: RMRKMarketplaceContractAddress,
  contractInterface: abis.marketplaceAbi,
};
