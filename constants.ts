
import abis from './abis/abis';

export const RMRKMultiResourceFactoryContractAddress = '0xE4554eC79fA96e31f08bDBD2673BBA75A3DE1a6C';
export const RMRKNestingFactoryContractAddress = '0xF74C56bEC934Bf6b816b556d0Ad17d8F1279d070';

//Moonscan MR https://moonbase.moonscan.io/address/0xB77520a5D97CAF7DEBC5AF7A28C19c49F063B4A5
//Moonscan Nesting https://moonbase.moonscan.io/address/0xd0c004801Af669857Bf0241235b7cBC3897F5932

export const multiResourceFactoryContract = {
  addressOrName: RMRKMultiResourceFactoryContractAddress,
  contractInterface: abis.multiResourceFactoryAbi
}

export const nestingFactoryContract = {
  addressOrName: RMRKNestingFactoryContractAddress,
  contractInterface: abis.nestingFactoryAbi
}
