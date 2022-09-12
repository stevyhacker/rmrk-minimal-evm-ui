import abis from './abis/abis';

export const RMRKMultiResourceFactoryContractAddress = process.env.NEXT_PUBLIC_RMRK_MULTI_RESOURCE_FACTORY_CONTRACT_ADDRESS;
export const RMRKNestingFactoryContractAddress = process.env.NEXT_PUBLIC_RMRK_NESTING_FACTORY_CONTRACT_ADDRESS;
export const RMRKEquippableFactoryContractAddress = process.env.NEXT_PUBLIC_RMRK_EQUIPPABLE_FACTORY_CONTRACT_ADDRESS;
export const RMRKMarketplaceContractAddress = process.env.NEXT_PUBLIC_RMRK_MARKETPLACE_CONTRACT_ADDRESS;

export const NATIVE_ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';


export const multiResourceFactoryContractDetails = {
  addressOrName: RMRKMultiResourceFactoryContractAddress,
  contractInterface: abis.multiResourceFactoryAbi,
};

export const nestingFactoryContractDetails = {
  addressOrName: RMRKNestingFactoryContractAddress,
  contractInterface: abis.nestingFactoryAbi,
};

export const equippableFactoryContractDetails = {
  addressOrName: RMRKEquippableFactoryContractAddress,
  contractInterface: abis.equippableFactoryAbi,
};

export const marketplaceContractDetails = {
  addressOrName: RMRKMarketplaceContractAddress,
  contractInterface: abis.marketplaceAbi,
};
