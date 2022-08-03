import styles from "../styles/Home.module.css"
import Image from "next/image"
import Link from "next/link"

const Nft = (props: {
  tokenContract: string
  tokenId: number
  tokenUri: string
}) => {
  return (
    <Link
      href={
        "//contract/" +
        `${encodeURIComponent(props.tokenContract)}/${encodeURIComponent(
          props.tokenId
        )}`
      }
    >
      <div className={styles.card}>
        <p className={styles.description}>Token ID: {props.tokenId}</p>
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
