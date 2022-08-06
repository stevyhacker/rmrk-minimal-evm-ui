import styles from "../styles/Home.module.css"
import Nft from "./nft"

const NftList = (props: {
  tokenContract: string
  tokenType: string
  nfts: { tokenId: number; owner: string; tokenUri: string }[]
}) => {
  return (
    <div className={styles.grid}>
      <div className={styles.container}>
        <h3>Your RMRK NFTs: {props.nfts?.length}</h3>
        {props.nfts?.map((nft, index) => {
          return (
            <div key={index}>
              <Nft
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
