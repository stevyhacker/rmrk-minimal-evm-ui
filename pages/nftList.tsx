import styles from "../styles/Home.module.css"
import Image from "next/image"

const NftList = (props: {
  nfts: { tokenId: number; owner: string; tokenUri: string }[]
}) => {
  return (
    <div className={styles.grid}>
      <div className={styles.container}>
        <h3>Your RMRK NFTs: {props.nfts.length}</h3>
        {props.nfts.map((nft, index) => {
          return (
            <div className={styles.card} key={index}>
              <p className={styles.description}>Token ID: {nft.tokenId}</p>
              <Image
                src={"https://ipfs.io/ipfs/" + nft.tokenUri}
                width={50}
                height={50}
                alt={""}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default NftList
