
import abis from './abis/abis';

export const RMRKMultiResourceImplContractAddress = '0xB77520a5D97CAF7DEBC5AF7A28C19c49F063B4A5';
export const RMRKNestingImplContractAddress = '0xd0c004801Af669857Bf0241235b7cBC3897F5932';
//Moonscan MR https://moonbase.moonscan.io/address/0xB77520a5D97CAF7DEBC5AF7A28C19c49F063B4A5
//Moonscan Nesting https://moonbase.moonscan.io/address/0xd0c004801Af669857Bf0241235b7cBC3897F5932

export const rmrkMultiResourceContract = {
  addressOrName: RMRKMultiResourceImplContractAddress,
  contractInterface: abis.multiResourceAbi,
};
