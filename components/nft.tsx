import styles from "../styles/Home.module.css"
import Image from "next/image"
import Link from "next/link"

const Nft = (props: {
  tokenContract: string
  collectionName: string
  tokenId: number
  tokenUri: string
  tokenType: string
}) => {
  return (
    <Link
      href={
        "/" +
        props.tokenType +
        "/" +
        `${encodeURIComponent(props.tokenContract)}/${encodeURIComponent(
          props.tokenId
        )}`
      }
    >
      <div className={styles.card}>
        {props.collectionName && (
          <p className="text-lg m-0.5">{props.collectionName}</p>
        )}
        <p className="text-lg m-0.5">Token ID: {props.tokenId}</p>
        <Image
          src={"https://ipfs.io/ipfs/" + props.tokenUri}
          width={50}
          height={50}
          alt={""}
        />
      </div>
    </Link>
  )
}

export default Nft
