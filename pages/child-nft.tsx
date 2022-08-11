import styles from "../styles/Home.module.css"
import Link from "next/link"
import Image from "next/image"
import React from "react"

function ChildNft(props: {
  uriComponent: string
  child: { tokenId: string; tokenUri: any }
}) {
  return (
    <div className={styles.card}>
      <Link
        href={
          "/nesting/" +
          `${encodeURIComponent(props.uriComponent)}/${encodeURIComponent(
            props.child.tokenId
          )}`
        }
      >
        <div>
          <p className="mb-2">Child Token ID: {props.child.tokenId}</p>

          <Image
            src={"https://ipfs.io/ipfs/" + props.child.tokenUri}
            width={100}
            height={100}
            alt={""}
          />
        </div>
      </Link>
    </div>
  )
}

export default ChildNft
