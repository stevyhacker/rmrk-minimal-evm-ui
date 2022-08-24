import styles from "../styles/Home.module.css"
import Nft from "./nft"

const NftList = (props: {
  tokenContract: string
  tokenType: string
  nfts: { tokenId: number; owner: string; tokenUri: string }[]
}) => {
  return (
    <div className={styles.grid}>
      <h3 className="font-semibold">Your RMRK NFTs: {props.nfts?.length}</h3>
      <div className={styles.container}>
        {props.nfts?.map((nft, index) => {
          return (
            <div key={index}>
              <Nft
                collectionName={''}
                tokenContract={props.tokenContract}
                tokenId={nft.tokenId}
                tokenUri={nft.tokenUri}
                tokenType={props.tokenType}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default NftList
