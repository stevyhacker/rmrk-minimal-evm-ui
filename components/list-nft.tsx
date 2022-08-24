import React, { useState } from "react"
import Nft from "./nft"
import { NftData } from "../pages/marketplace"

function ListNft(props: {
  nft: NftData
  approveOnClick: () => void
  buyOnClick: (priceInput: number) => void
}) {

  const [priceInput, setPriceInput] = useState<number>(0)

  function handlePriceInput(e: React.ChangeEvent<HTMLInputElement>) {
    // @ts-ignore
    setPriceInput(e.target.value)
  }

  return (
    <div className="card-bordered rounded-box m-2">
      <Nft
        tokenContract={props.nft.tokenContract}
        collectionName={props.nft.collectionName}
        tokenId={props.nft.tokenId}
        tokenUri={props.nft.tokenUri}
        tokenType={"contract"}
      />
      <div className="form-control">
        <label className="text-sm mb-0.5 ml-4">Sale price</label>
        <input
          inputMode="numeric"
          pattern="[0-9]+([\.,][0-9]+)?"
          step="0.0001"
          placeholder="Sale price"
          value={priceInput}
          onChange={handlePriceInput}
          className="input input-bordered mx-2 input-sm"
        ></input>
        {!props.nft.approved && (
          <button
            onClick={props.approveOnClick}
            className="btn btn-primary btn-sm mx-2 my-2"
          >
            Approve NFT for sale
          </button>
        )}
        {props.nft.approved && (
          <button
            onClick={props.buyOnClick.bind(null, priceInput)}
            className="btn btn-primary btn-sm mx-2 my-2 "
          >
            Sell NFT
          </button>
        )}
      </div>
    </div>
  )
}

export default ListNft
