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
  NATIVE_ETH,
  nestingFactoryContractDetails,
} from "../constants"
import Nft from "../components/nft"
import ListNft from "../components/list-nft"

export interface NftData {
  tokenId: number
  owner: string
  tokenUri: string
  tokenContract: string
  collectionName: string
  approved: boolean
}

export interface ListingData {
  listingId: number
  tokenId: number
  owner: string
  tokenUri: string
  tokenContract: string
  collectionName: string
  approved: boolean
  saleStartTime: string
  saleEndTime: string
  price: any
}

const Marketplace: NextPage = () => {
  const provider = useProvider()
  const { data: signer, isSuccess } = useSigner()
  const { address, isConnected } = useAccount()
  const addRecentTransaction = useAddRecentTransaction()
  const [loading, setLoading] = useState<boolean>(true)
  const [ownedNfts, setOwnedNfts] = useState<NftData[]>([])
  const [listedNfts, setListedNfts] = useState<ListingData[]>([])

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

  async function getListedNfts() {
    const nfts: ListingData[] = []
    const totalListings = await marketplaceContract.totalListings()
    for (let i = 0; i < totalListings; i++) {
      const nft = await marketplaceContract.listings(i)
      const tokenContract = new Contract(nft[2], erc721ABI, provider)
      nfts.push({
        listingId: nft[0].toNumber(),
        owner: nft[1],
        tokenContract: nft[2],
        tokenId: nft[3].toNumber(),
        tokenUri: await tokenContract.tokenURI(nft[3]),
        saleStartTime: nft[4].toString(),
        saleEndTime: nft[5].toString(),
        approved: await tokenContract.isApprovedForAll(
          address,
          marketplaceContract.address
        ),
        collectionName: await tokenContract.name(),
        price: nft[9],
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

      // console.log(allRmrkCollectionDeployments.length + " collections")

      for (let i = 0; i < allRmrkCollectionDeployments.length; i++) {
        // console.log(allRmrkCollectionDeployments[i])
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

  function formatTime(time: string) {
    const dtFormat = new Intl.DateTimeFormat("en-GB", {
      timeZone: "UTC",
      dateStyle: "medium",
      timeStyle: "short",
    })

    return dtFormat.format(new Date(Number(time) * 1e3))
  }

  async function sellNft(
    tokenContractAddress: string,
    tokenId: number,
    price: number
  ) {
    if (signer instanceof Signer) {
      const tokenContract = new Contract(
        tokenContractAddress,
        abis.multiResourceAbi,
        provider
      )

      console.log(
        "marketplace: \n" +
          marketplaceContract.address +
          "\n\ntokenContract: \n" +
          tokenContractAddress +
          "\n\ntokenId: \n" +
          tokenId +
          "\n\nprice: \n" +
          price +
          "\n\nsigner: \n" +
          (await signer.getAddress()) +
          "\n\ntime: \n" +
          Date.now() +
          "\n\ntoken owner: \n" +
          (await tokenContract.ownerOf(tokenId)) +
          "\n\napproved for: \n" +
          (await tokenContract.isApprovedForAll(
            address,
            marketplaceContract.address
          )) +
          "\n\nget approved: \n" +
          (await tokenContract.getApproved(tokenId))
      )
      const listing = {
        assetContract: tokenContractAddress,
        tokenId: tokenId,
        // when should the listing open up for offers
        startTime: Math.floor(Date.now() / 1000) + 120,
        // how long the listing will be open for
        secondsUntilEndTime: 7 * 24 * 60 * 60,
        quantityToList: 1,
        // address of the currency contract that will be used to pay for the listing
        // currencyToAccept: "0x0000000000000000000000000000000000000802",
        currencyToAccept: NATIVE_ETH, // for native ETH
        // how much the asset will be sold for
        reservePricePerToken: ethers.utils.parseEther(price.toString()),
        buyoutPricePerToken: ethers.utils.parseEther(price.toString()),
        listingType: 0,
      }

      console.log("listing")
      console.log(listing)

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

  async function buyNft(
    listingId: number,
    tokenContractAddress: string,
    tokenId: number,
    price: number
  ) {
    const options = { value: price }

    console.log("Listing ID: " + listingId)

    const tx = await marketplaceContract
      .connect(signer)
      .buy(listingId, address, 1, NATIVE_ETH, price, options)

    addRecentTransaction({
      hash: tx.hash,
      description: "Buying a new RMRK NFT",
      confirmations: 1,
    })

    await tx.wait(1)
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
    if (signer instanceof Signer) {
      console.log("Loading chain data")
      fetchData()
    }
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
      // .approve(marketplaceContract.address, tokenId)

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
              <ListNft
                key={index}
                nft={nft}
                approveOnClick={() => {
                  approveNft(nft.tokenContract, nft.tokenId).then(() => {
                    fetchData()
                  })
                }}
                buyOnClick={(priceInput) => {
                  sellNft(nft.tokenContract, nft.tokenId, priceInput).then(
                    () => {
                      fetchData()
                    }
                  )
                }}
              />
            )
          })}
        </div>

        <h3 className={styles.description}>
          NFTs for sale: {listedNfts?.length}
        </h3>
        <div className="flex flex-wrap justify-center">
          {listedNfts?.map((nft, index) => {
            return (
              <div className="card-bordered rounded-box m-2" key={index}>
                <Nft
                  tokenContract={nft.tokenContract}
                  collectionName={nft.collectionName}
                  tokenId={nft.tokenId}
                  tokenUri={nft.tokenUri}
                  tokenType={"contract"}
                />
                <div className="form-control">
                  <p className="text-center text-lg mx-2 mb-2">
                    Price:{" "}
                    <span className="font-semibold">
                      {ethers.utils.formatEther(nft.price)}
                    </span>{" "}
                    ETH
                  </p>
                  <p className="text-center mx-2 mb-0.5">
                    Sale start time:{" "}
                    <span className="font-semibold">
                      {formatTime(nft.saleStartTime)}
                    </span>
                  </p>
                  <p className="text-center mx-2 mb-0.5">
                    Sale end time:{" "}
                    <span className="font-semibold">
                      {formatTime(nft.saleEndTime)}
                    </span>
                  </p>
                  <button
                    onClick={() => {
                      buyNft(
                        nft.listingId,
                        nft.tokenContract,
                        nft.tokenId,
                        nft.price
                      ).then(() => {
                        fetchData()
                      })
                    }}
                    className="btn btn-primary btn-sm mx-2 my-2"
                  >
                    Buy NFT
                  </button>
                </div>
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
