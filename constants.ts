import abis from './abis/abis';

// MoonbaseAlpha deployments
// export const RMRKMultiResourceFactoryContractAddress = '0x8E1214B2eD8a8581D1f35f525d82E9077C2c7513';
// export const RMRKNestingFactoryContractAddress = '0x2a962fA5DD393507B2b1C527d2aa52EBC298f689';
// export const RMRKMarketplaceContractAddress = '0xbdf6DB34C85669DCf090781d43b8F5391DE38DEd';

// Goerli deployments
export const RMRKMultiResourceFactoryContractAddress = '0x7ceAac56456bc4d159F27Bcc7e73583B75B61779';
export const RMRKNestingFactoryContractAddress = '0x40b3C66b1258DcEAf5dD67CcE8Ba048Db0CD4Da4';
export const RMRKMarketplaceContractAddress = '0x8570D89931564Ac05b1b97aB143e3f6815028740';

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
