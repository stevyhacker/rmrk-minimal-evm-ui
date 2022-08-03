
import abis from './abis/abis';

export const RMRKMultiResourceImplContractAddress = '0xB77520a5D97CAF7DEBC5AF7A28C19c49F063B4A5';
export const RMRKMultiResourceFactoryContractAddress = '0xB2A7dB4056452e09afD94a497333F64B5f55569e';
export const RMRKNestingFactoryContractAddress = '0xAf8445e05998E000d7fCB5CAD71734364499Bc99';

//Moonscan MR https://moonbase.moonscan.io/address/0xB77520a5D97CAF7DEBC5AF7A28C19c49F063B4A5
//Moonscan Nesting https://moonbase.moonscan.io/address/0xd0c004801Af669857Bf0241235b7cBC3897F5932

export const rmrkMultiResourceContract = {
  addressOrName: RMRKMultiResourceImplContractAddress,
  contractInterface: abis.multiResourceAbi,
};


export const multiResourceFactoryContract = {
  addressOrName: RMRKMultiResourceFactoryContractAddress,
  contractInterface: abis.multiResourceFactoryAbi
}

export const nestingFactoryContract = {
  addressOrName: RMRKNestingFactoryContractAddress,
  contractInterface: abis.nestingFactoryAbi
}
