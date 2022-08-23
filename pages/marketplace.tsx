import { ConnectButton, useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import type { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import {
  erc721ABI,
  useAccount,
  useContract,
  useProvider,
  useSigner,
} from "wagmi"
import { Contract, ethers, Signer } from "ethers"
import React, { useEffect, useState } from "react"
import abis from "../abis/abis"
import {
  marketplaceContractDetails,
  multiResourceFactoryContractDetails,
  nestingFactoryContractDetails,
} from "../constants"
import Nft from "../components/nft"

interface NftData {
  tokenId: number
  owner: string
  tokenUri: string
  tokenContract: string
  collectionName: string
  approved: boolean
}

const Marketplace: NextPage = () => {
  const provider = useProvider()
  const { data: signer, isSuccess } = useSigner()
  const { address, isConnected } = useAccount()
  const addRecentTransaction = useAddRecentTransaction()
  const [loading, setLoading] = useState<boolean>(true)
  const [priceInput, setPriceInput] = useState<number>(0)
  const [ownedNfts, setOwnedNfts] = useState<NftData[]>([])
  const [listedNfts, setListedNfts] = useState<NftData[]>([])

  const marketplaceContract = useContract({
    ...marketplaceContractDetails,
    signerOrProvider: signer,
  })

  const nestingFactoryContract = useContract({
    ...nestingFactoryContractDetails,
    signerOrProvider: signer,
  })

  const factoryContract = useContract({
    ...multiResourceFactoryContractDetails,
    signerOrProvider: signer,
  })

  function handlePriceInput(e: React.ChangeEvent<HTMLInputElement>) {
    setPriceInput(e.target.value)
  }

  async function getListedNfts() {
    const nfts: NftData[] = []
    const totalListings = await marketplaceContract.totalListings()
    for (let i = 0; i < totalListings; i++) {
      const nft = await marketplaceContract.listings(i)
      const tokenContract = new Contract(nft[2], erc721ABI, provider)
      nfts.push({
        tokenId: nft[3],
        owner: nft[1],
        tokenUri: await tokenContract.tokenURI(i),
        tokenContract: nft[2],
        approved: await tokenContract.isApprovedForAll(
          address,
          marketplaceContract.address
        ),
        collectionName: await tokenContract.name(),
      })
    }
    return nfts
  }

  async function getOwnedNfts() {
    const nfts: NftData[] = []

    if (signer instanceof Signer) {
      const multiResourceRmrkCollectionDeployments =
        await factoryContract.getCollections()

      const nestingCollectionDeployments =
        await nestingFactoryContract.getCollections()

      const allRmrkCollectionDeployments = [
        ...multiResourceRmrkCollectionDeployments,
        ...nestingCollectionDeployments,
      ]

      console.log(allRmrkCollectionDeployments.length + " collections")

      for (let i = 0; i < allRmrkCollectionDeployments.length; i++) {
        console.log(allRmrkCollectionDeployments[i])
        const collectionContract = new Contract(
          allRmrkCollectionDeployments[i],
          abis.multiResourceAbi,
          provider
        )
        // rmrkCollections.push(collectionContract)
        const nftSupply = await collectionContract.totalSupply()
        for (let i = 0; i < nftSupply; i++) {
          let isOwner = false
          try {
            isOwner =
              (await collectionContract.connect(signer).ownerOf(i)) == address
          } catch (error) {
            // console.log(error)
          }
          if (isOwner) {
            nfts.push({
              tokenId: i,
              owner: await signer.getAddress(),
              tokenUri: await collectionContract.tokenURI(i),
              tokenContract: collectionContract.address,
              approved: await collectionContract.isApprovedForAll(
                address,
                marketplaceContract.address
              ),
              collectionName: await collectionContract.name(),
            })
          }
        }
      }
    }
    return nfts
  }

  async function sellNft(
    tokenContractAddress: string,
    tokenId: number,
    price: number
  ) {
    if (signer instanceof Signer) {
      console.log(
        marketplaceContract.address +
          " " +
          tokenContractAddress +
          " " +
          tokenId +
          " " +
          price +
          " " +
          (await signer.getAddress()) +
          " " +
          Date.now()
      )
      const listing = {
        assetContract: tokenContractAddress,
        tokenId: tokenId,
        // when should the listing open up for offers
        startTime: Date.now() + 100000000,
        // how long the listing will be open for
        secondsUntilEndTime: 86400,
        quantityToList: 1,
        // address of the currency contract that will be used to pay for the listing
        currencyToAccept: "0x0000000000000000000000000000000000000802",
        // currencyToAccept: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", for native ETH
        // how much the asset will be sold for
        reservePricePerToken: ethers.utils.parseEther(price.toString()),
        buyoutPricePerToken: ethers.utils.parseEther(price.toString()),
        listingType: 0,
      }

      const tx = await marketplaceContract
        .connect(signer)
        .createListing(listing)

      const receipt = tx.receipt // the transaction receipt
      const listingId = tx.id // the id of the newly created listing

      addRecentTransaction({
        hash: tx.hash,
        description: "Listing a new RMRK NFT",
        confirmations: 1,
      })

      await tx.wait(1)
    }
  }

  function fetchData() {
    setLoading(true)
    getListedNfts().then((nfts) => {
      setListedNfts(nfts)
      setLoading(false)
    })
    getOwnedNfts().then((nfts) => {
      setOwnedNfts(nfts)
      setLoading(false)
    })
  }

  useEffect(() => {
    console.log("Loading chain data")
    fetchData()
  }, [signer])

  async function approveNft(tokenContractAddress: string, tokenId: number) {
    if (signer instanceof Signer) {
      const tokenContract = new Contract(
        tokenContractAddress,
        erc721ABI,
        provider
      )

      const tx = await tokenContract
        .connect(signer)
        .setApprovalForAll(marketplaceContract.address, true)

      addRecentTransaction({
        hash: tx.hash,
        description: "Approving NFT collection for sale",
        confirmations: 1,
      })

      await tx.wait(1)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>RMRK Marketplace</title>
        <meta
          name="description"
          content="Generated by @rainbow-me/create-rainbowkit"
        />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>RMRK Marketplace</h1>

        <p className="mb-4">Buy or Sell NFTs on the RMRK Marketplace:</p>

        <p className="mt-5">
          Your RMRK NFT Contract will be deployed on the Moonbase Alpha testnet.{" "}
        </p>

        <h3 className={styles.description}>
          Your RMRK NFTs: {ownedNfts?.length}
        </h3>
        <div className="flex flex-wrap justify-center">
          {ownedNfts?.map((nft, index) => {
            return (
              <div className="mx-0.5" key={index}>
                <Nft
                  tokenContract={nft.tokenContract}
                  collectionName={nft.collectionName}
                  tokenId={nft.tokenId}
                  tokenUri={nft.tokenUri}
                  tokenType={"contract"}
                />
                <div className="form-control mb-2">
                  <label className="label">Sale price</label>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]+([\.,][0-9]+)?"
                    step="0.0001"
                    placeholder="Sale price"
                    className="input input-bordered input-sm"
                    value={priceInput}
                    onChange={handlePriceInput}
                  ></input>
                  {!nft.approved && (
                    <button
                      onClick={() => {
                        approveNft(nft.tokenContract, nft.tokenId).then(() => {
                          fetchData()
                        })
                      }}
                      className="btn btn-primary btn-sm mx-2 my-2"
                    >
                      Approve NFT for sale
                    </button>
                  )}
                  {nft.approved && (
                    <button
                      onClick={() => {
                        sellNft(
                          nft.tokenContract,
                          nft.tokenId,
                          priceInput
                        ).then(() => {
                          // fetchData()
                        })
                      }}
                      className="btn btn-primary btn-sm mx-2 my-2 "
                    >
                      Sell NFT
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <h3 className={styles.description}>
          NFTs for sale: {listedNfts?.length}
        </h3>
        <div className="flex flex-wrap justify-center">
          {listedNfts?.map((nft, index) => {
            return (
              <div key={index}>
                <Nft
                  tokenContract={nft.tokenContract}
                  collectionName={nft.collectionName}
                  tokenId={nft.tokenId}
                  tokenUri={nft.tokenUri}
                  tokenType={"contract"}
                />
              </div>
            )
          })}
        </div>

        {loading && <progress className="progress mt-2 w-72"></progress>}
      </main>

      <footer className={styles.footer}></footer>
    </div>
  )
}

export default Marketplace
