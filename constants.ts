
import abis from './abis/abis';

export const RMRKMultiResourceImplContractAddress = '0x1879a7338F7682Ae3AeeB3F696eAD5481D789183';
export const RMRKNestingImplContractAddress = '0xd0c004801Af669857Bf0241235b7cBC3897F5932';
//Moonscan MR https://moonbase.moonscan.io/address/0x1879a7338F7682Ae3AeeB3F696eAD5481D789183
//Moonscan Nesting https://moonbase.moonscan.io/address/0xd0c004801Af669857Bf0241235b7cBC3897F5932

export const rmrkMultiResourceContract = {
  addressOrName: RMRKMultiResourceImplContractAddress,
  contractInterface: abis.multiResourceAbi,
};
