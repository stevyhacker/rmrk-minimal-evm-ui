import abis from './abis/abis';

// MoonbaseAlpha deployments
// export const RMRKMultiResourceFactoryContractAddress = '0x8E1214B2eD8a8581D1f35f525d82E9077C2c7513';
// export const RMRKNestingFactoryContractAddress = '0x2a962fA5DD393507B2b1C527d2aa52EBC298f689';
// export const RMRKMarketplaceContractAddress = '0xbdf6DB34C85669DCf090781d43b8F5391DE38DEd';

// Goerli deployments
export const RMRKMultiResourceFactoryContractAddress = '0x35599CfFCdC8Bb29e77e316Be974D31B6a932eD2';
export const RMRKNestingFactoryContractAddress = '0xa8660beBD6F526bd6614983E98eB95E7905C822A';
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
