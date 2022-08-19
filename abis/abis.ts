import RMRKMultiResourceImpl from './RMRKMultiResourceImpl.json';
import RMRKMultiResourceFactory from './RMRKMultiResourceFactory.json';
import RMRKNestingFactory from './RMRKNestingFactory.json';
import RMRKNestingMultiResourceImpl from './RMRKNestingMultiResourceImpl.json';
import RMRKMarketplace from './RMRKMarketplace.json';

const abis = {
  multiResourceAbi: RMRKMultiResourceImpl.abi,
  multiResourceFactoryAbi: RMRKMultiResourceFactory.abi,
  nestingFactoryAbi: RMRKNestingFactory.abi,
  nestingImplAbi: RMRKNestingMultiResourceImpl.abi,
  marketplaceAbi: RMRKMarketplace.abi,
};

export default abis;
