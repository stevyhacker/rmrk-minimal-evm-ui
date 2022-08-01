
import abis from './abis/abis';

export const RMRKMultiResourceImplContractAddress = '0xB77520a5D97CAF7DEBC5AF7A28C19c49F063B4A5';
export const RMRKMultiResourceFactoryContractAddress = '0x8b30c61B462a05C6a6ef04971956EdD4711264Dc';
export const RMRKNestingFactoryContractAddress = '0x3E9cC60DB946963B0a64403FEeBE7E20d4553443';

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
