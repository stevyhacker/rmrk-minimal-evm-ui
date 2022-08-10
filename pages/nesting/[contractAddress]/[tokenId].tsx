import { useRouter } from "next/router"
import styles from "../../../styles/Home.module.css"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { Signer } from "ethers"
import { useContract, useProvider, useSigner } from "wagmi"
import { ConnectButton, useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import Resource from "../../../components/resource"
import abis from "../../../abis/abis"
import Link from "next/link"
import { sign } from "crypto"

const NestingNft = () => {
  const provider = useProvider()
  const { data: signer } = useSigner()
  const addRecentTransaction = useAddRecentTransaction()
  const router = useRouter()
  const query: string[] = router.asPath.split("/")
  const contractAddress = query[2]
  const tokenId = query[3]
  const [resourceInput, setResourceInput] = useState<string>("")
  const [tokenUri, setTokenUri] = useState<string>("")
  const [collectionName, setCollectionName] = useState<string>("")
  const [resources, setResources] = useState<string[]>([])
  const [childrenTokens, setChildrenTokens] = useState<string[]>([])
  const [pendingChildren, setPendingChildren] = useState<string[]>([])
  const [pendingResources, setPendingResources] = useState<string[]>([])
  const [activeResources, setActiveResources] = useState<string[]>([])
  const [allResourcesData, setAllResourcesData] = useState<string[]>([])
  const [activeResourcesData, setActiveResourcesData] = useState<string[]>([])
  const [pendingResourcesData, setPendingResourcesData] = useState<string[]>([])
  const nestingContract = useContract({
    addressOrName: contractAddress as string,
    contractInterface: abis.nestingImplAbi,
    signerOrProvider: provider,
  })
  const [ownedNfts, setOwnedNfts] = useState<
    { tokenId: number; owner: string; tokenUri: string }[]
  >([])

  useEffect(() => {
    console.log("getting " + contractAddress + " data for token id: " + tokenId)
    if (Number(tokenId) >= 0) {
      fetchNft().then(() => {})
    }
  }, [contractAddress, tokenId])

  async function fetchNft() {
    const name: string = await nestingContract.name()
    const tokenUri: string = await nestingContract.tokenURI(tokenId)
    const allResources: string[] = await nestingContract.getAllResources()
    const children: string[] = await nestingContract.childrenOf(tokenId)
    const pendingChildren: string[] = await nestingContract.pendingChildrenOf(
      tokenId
    )
    const activeResources: string[] = await nestingContract.getActiveResources(
      tokenId
    )
    const pendingResources: string[] =
      await nestingContract.getPendingResources(tokenId)
    const allData: string[] = []
    const pendingResourcesData: string[] = []
    const activeResourcesData: string[] = []
    const nfts = []
    const nftSupply = await nestingContract.totalSupply()

    if (signer instanceof Signer) {
      console.log("Fetching NFT collection")
      const signerAddress = await signer.getAddress()
      for (let i = 0; i < nftSupply; i++) {
        let isOwner = false
        try {
          isOwner =
            (await nestingContract.connect(signer).ownerOf(i)) == signerAddress
        } catch (error) {
          // console.log(error)
        }
        if (isOwner && i != Number(tokenId)) {
          nfts.push({
            tokenId: i,
            owner: signerAddress,
            tokenUri: await nestingContract.tokenURI(i),
          })
        }
      }
      setOwnedNfts(nfts)
    }
    for (const r of allResources) {
      const resourceData = await nestingContract.getResource(r)
      allData.push(resourceData)
    }
    for (const r of pendingResources) {
      const resourceData = await nestingContract.getResource(r)
      pendingResourcesData.push(resourceData)
    }
    for (const r of activeResources) {
      const resourceData = await nestingContract.getResource(r)
      activeResourcesData.push(resourceData)
    }
    setAllResourcesData(allData)
    setPendingResourcesData(pendingResourcesData)
    setActiveResourcesData(activeResourcesData)
    setChildrenTokens(children)
    setPendingChildren(pendingChildren)
    setCollectionName(name)
    setResources(allResources)
    setActiveResources(activeResources)
    setPendingResources(pendingResources)
    setTokenUri(tokenUri)
  }

  async function addResource() {
    if (signer instanceof Signer) {
      const tx = await nestingContract
        .connect(signer)
        .addResourceEntry(resourceInput)
      addRecentTransaction({
        hash: tx.hash,
        description: "Adding a new resource to collection",
        confirmations: 1,
      })
    }
  }

  async function rejectResource(resourceId: number) {
    if (signer instanceof Signer) {
      const tx = await nestingContract
        .connect(signer)
        .rejectResource(tokenId, resourceId)
      addRecentTransaction({
        hash: tx.hash,
        description: "Rejecting a resource for this NFT",
        confirmations: 1,
      })
    }
  }

  async function acceptResource(resourceId: number) {
    if (signer instanceof Signer) {
      const tx = await nestingContract
        .connect(signer)
        .acceptResource(tokenId, resourceId)
      addRecentTransaction({
        hash: tx.hash,
        description: "Accepting a resource for this NFT",
        confirmations: 1,
      })
    }
  }

  async function addResourceToToken(resourceId: number) {
    if (signer instanceof Signer) {
      const tx = await nestingContract
        .connect(signer)
        .addResourceToToken(tokenId, resourceId, 0)
      addRecentTransaction({
        hash: tx.hash,
        description: "Adding a resource to this NFT",
        confirmations: 1,
      })
    }
  }

  async function addChildToToken(childTokenId: number) {
    if (signer instanceof Signer) {
      console.log(
        "tokenId: " +
          tokenId +
          " childTokenId: " +
          childTokenId +
          " contractAddress: " +
          contractAddress
      )
      const tx = await nestingContract
        .connect(signer)
        .addChild(tokenId, childTokenId, contractAddress)
      addRecentTransaction({
        hash: tx.hash,
        description: "Adding a child token to this NFT",
        confirmations: 1,
      })
    }
  }

  function handleResourceInput(e: React.ChangeEvent<HTMLInputElement>) {
    setResourceInput(e.target.value)
  }

  return (
    <main className={styles.main}>
      <ConnectButton />

      <h4 className={styles.description}>Collection name: {collectionName}</h4>
      <ul className="mt-1">Usage Notes:</ul>
      <li>
        You have to be the Owner of the NFT or Approved to accept or reject a
        resource
      </li>
      <li>
        You have to be the Owner of the NFT Collection to add new resources
      </li>
      <li>
        If you are not authorized like above the transactions will be reverted
      </li>
      <div className={styles.nft}>
        <p>Token ID: {tokenId}</p>
        <Image
          src={"https://ipfs.io/ipfs/" + tokenUri}
          width={50}
          height={50}
          alt={""}
        />
        <div>
          <h1 className="text-center text-xl mt-5"> Token Children:</h1>
          {childrenTokens.map((resource, index) => {
            return (
              <div key={index} className={styles.card}>
                <p>Token #{index}</p>
              </div>
            )
          })}
          <h1 className="text-center text-xl mt-5"> Token Pending Children:</h1>
          {pendingChildren.map((resource, index) => {
            return (
              <div key={index} className={styles.card}>
                <p>Token #{index}</p>
              </div>
            )
          })}
          <h1 className="text-center text-xl mt-5"> Token Active Resources:</h1>
          {activeResources.map((resource, index) => {
            return (
              <div key={index} className={styles.card}>
                <Resource
                  key={index}
                  resource={resource}
                  strings={activeResourcesData}
                  index={index}
                />
              </div>
            )
          })}
          <h1 className="text-center text-xl mt-5">Token Pending Resources:</h1>
          {pendingResources.map((resource, index) => {
            return (
              <div key={index} className={styles.card}>
                <Resource
                  key={index}
                  resource={resource}
                  strings={pendingResourcesData}
                  index={index}
                />
                <button
                  className="btn btn-primary ml-2 "
                  onClick={() => {
                    acceptResource(index).then(() => fetchNft())
                  }}
                >
                  Accept Resource
                </button>
                <button
                  className="btn btn-secondary ml-1"
                  onClick={() => {
                    rejectResource(index).then(() => fetchNft())
                  }}
                >
                  Reject Resource
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-center text-2xl mt-10">NFT Collection Tokens:</p>

      <div className={styles.grid}>
        <div className={styles.container}>
          {ownedNfts?.map((nft, index) => {
            return (
              <div key={index}>
                <div className={styles.card}>
                  <Link
                    href={
                      "/nesting/" +
                      `${encodeURIComponent(
                        contractAddress
                      )}/${encodeURIComponent(nft.tokenId)}`
                    }
                  >
                    <div>
                      <p className={styles.description}>
                        Token ID: {nft.tokenId}
                      </p>
                      <Image
                        src={"https://ipfs.io/ipfs/" + nft.tokenUri}
                        width={100}
                        height={100}
                        alt={""}
                      />
                    </div>
                  </Link>

                  <div>
                    <button
                      className="btn btn-primary btn-sm ml-2 "
                      onClick={() => {
                        addChildToToken(nft.tokenId).then(r => fetchNft())
                      }}
                    >
                      Add child to token
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-center text-2xl mt-10">NFT Collection Resources:</p>
      {resources.map((resourceId, index) => {
        return (
          <div key={index} className={styles.card}>
            <Resource
              key={index}
              resource={resourceId}
              strings={allResourcesData}
              index={index}
            />
            <button
              className="btn btn-primary btn-sm ml-2 "
              onClick={() => {
                addResourceToToken(Number(resourceId)).then(() => fetchNft())
              }}
            >
              Add resource to token
            </button>
          </div>
        )
      })}
      <input
        inputMode="text"
        placeholder="Resource metadata URI"
        className="input input-bordered w-full max-w-xs mt-4 mb-2"
        value={resourceInput}
        onChange={handleResourceInput}
      ></input>
      <button
        className="btn btn-primary mt-2"
        onClick={() => {
          addResource().then(() => fetchNft())
        }}
      >
        Add New Resource
      </button>
    </main>
  )
}

export default NestingNft
