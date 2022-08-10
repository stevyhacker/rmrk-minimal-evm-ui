
import abis from './abis/abis';

export const RMRKMultiResourceFactoryContractAddress = '0x8E1214B2eD8a8581D1f35f525d82E9077C2c7513';
export const RMRKNestingFactoryContractAddress = '0x2a962fA5DD393507B2b1C527d2aa52EBC298f689';

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
