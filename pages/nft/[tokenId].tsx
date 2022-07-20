import { useRouter } from "next/router"
import styles from "../../styles/Home.module.css"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { Contract, Signer } from "ethers"
import { rmrkMultiResourceContract } from "../../constants"
import { useProvider, useSigner } from "wagmi"
import { ConnectButton, useAddRecentTransaction } from "@rainbow-me/rainbowkit"

const MultiResourceNft = () => {
  const provider = useProvider()
  const { data: signer } = useSigner()
  const addRecentTransaction = useAddRecentTransaction()

  const router = useRouter()
  const { tokenId } = router.query
  const [resourceInput, setResourceInput] = useState<string>("")
  const [tokenUri, setTokenUri] = useState<string>("")
  const [collectionName, setCollectionName] = useState<string>("")
  const [resources, setResources] = useState<string[]>([])
  const [pendingResources, setPendingResources] = useState<string[]>([])
  const [activeResources, setActiveResources] = useState<string[]>([])
  const [allResourcesData, setAllResourcesData] = useState<string[]>([])
  const [activeResourcesData, setActiveResourcesData] = useState<string[]>([])
  const [pendingResourcesData, setPendingResourcesData] = useState<string[]>([])
  const multiResourceContract = new Contract(
    rmrkMultiResourceContract.addressOrName,
    rmrkMultiResourceContract.contractInterface,
    provider
  )

  useEffect(() => {
    console.log("getting nft data" + " for token id: " + tokenId)
    if (Number(tokenId) >= 0) {
      fetchNft().then((nft) => {
        setCollectionName(nft.name)
        setResources(nft.allResources)
        setActiveResources(nft.activeResources)
        setPendingResources(nft.pendingResources)
        setTokenUri(nft.tokenUri)
      })
    }
  }, [tokenId])

  async function fetchNft() {
    const name: string = await multiResourceContract.name()
    const tokenUri: string = await multiResourceContract.tokenURI(tokenId)
    const allResources: string[] = await multiResourceContract.getAllResources()
    const activeResources: string[] =
      await multiResourceContract.getActiveResources(tokenId)
    const pendingResources: string[] =
      await multiResourceContract.getPendingResources(tokenId)
    const allData: string[] = []
    const pendingResourcesData: string[] = []
    const activeResourcesData: string[] = []
    for (const r of allResources) {
      const resourceData = await multiResourceContract.getResource(r)
      allData.push(resourceData[1])
    }
    for (const r of pendingResources) {
      const resourceData = await multiResourceContract.getResource(r)
      pendingResourcesData.push(resourceData[1])
    }
    for (const r of activeResources) {
      const resourceData = await multiResourceContract.getResource(r)
      activeResourcesData.push(resourceData[1])
    }
    setAllResourcesData(allData)
    setPendingResourcesData(pendingResourcesData)
    setActiveResourcesData(activeResourcesData)
    return { name, allResources, activeResources, pendingResources, tokenUri }
  }

  async function addResource() {
    if (signer instanceof Signer) {
      const tx = await multiResourceContract
        .connect(signer) //TODO FIXME add auto incrementing IDs to resources in Multi Resource factory
        //resource IDs are randomized for now as a temporary solution
        .addResourceEntry(Math.floor(Math.random() * 999999), resourceInput, [])
      addRecentTransaction({
        hash: tx.hash,
        description: "Adding a new resource to collection",
        confirmations: 1,
      })
    }
  }

  async function rejectResource(resourceId: number) {
    if (signer instanceof Signer) {
      const tx = await multiResourceContract
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
      const tx = await multiResourceContract
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
      const tx = await multiResourceContract
        .connect(signer)
        .addResourceToToken(tokenId, resourceId, 0)
      addRecentTransaction({
        hash: tx.hash,
        description: "Adding a resource to this NFT",
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
          <h1 className="text-center text-xl mt-5"> Token Active Resources:</h1>
          {activeResources.map((resource, index) => {
            return (
              <div className={styles.card} key={index}>
                <p>Resource ID: {resource + ""}</p>
                <code className="text-sm">
                  {activeResourcesData[index] + ""}
                </code>
                <Image
                  src={"https://ipfs.io/ipfs/" + activeResourcesData[index]}
                  width={100}
                  height={100}
                  alt={""}
                />
              </div>
            )
          })}
          <h1 className="text-center text-xl mt-5">Token Pending Resources:</h1>
          {pendingResources.map((resource, index) => {
            return (
              <div className={styles.card} key={index}>
                <p>Resource ID: {resource + ""}</p>
                <code className="text-sm">
                  {pendingResourcesData[index] + ""}
                </code>
                <Image
                  src={"https://ipfs.io/ipfs/" + pendingResourcesData[index]}
                  width={100}
                  height={100}
                  alt={""}
                />
                <div>
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
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-center text-2xl mt-10">NFT Collection Resources:</p>
      {resources.map((resource, index) => {
        return (
          <div className={styles.card} key={index}>
            <p>Resource ID: {resource + ""}</p>
            <code className="text-sm">{allResourcesData[index] + ""}</code>
            <Image
              src={"https://ipfs.io/ipfs/" + allResourcesData[index]}
              width={100}
              height={100}
              alt={""}
            />
            <div className="">
              <button
                className="btn btn-primary btn-sm ml-2 "
                onClick={() => {
                  addResourceToToken(index).then(() => fetchNft())
                }}
              >
                Add resource to token
              </button>
              <button
                onClick={() => {
                  addCustomData(index).then(() => fetchNft())
                }}
                className="btn btn-primary btn-sm m-1"
              >
                Add custom data
              </button>
              <button
                onClick={() => {
                  setCustomData(index).then(() => fetchNft())
                }}
                className="btn btn-secondary btn-sm m-1"
              >
                Set custom data
              </button>
              <button
                onClick={() => {
                  removeCustomData(index).then(() => fetchNft())
                }}
                className="btn btn-secondary btn-sm m-1"
              >
                Remove custom data
              </button>
            </div>
          </div>
        )
      })}
      <input
        inputMode="text"
        placeholder="metadataURI"
        className="input input-bordered w-full max-w-xs"
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

export default MultiResourceNft
