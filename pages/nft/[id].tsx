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
  const { id } = router.query
  const [resourceInput, setResourceInput] = useState<string>("")
  const [tokenUri, setTokenUri] = useState<string>("")
  const [collectionName, setCollectionName] = useState<string>("")
  const [resources, setResources] = useState<string[]>([])
  const [tokenResources, setTokenResources] = useState<string[]>([])
  const [allResourcesData, setAllResourcesData] = useState<string[]>([])
  const [tokenResourcesData, setTokenResourcesData] = useState<string[]>([])
  const multiResourceContract = new Contract(
    rmrkMultiResourceContract.addressOrName,
    rmrkMultiResourceContract.contractInterface,
    provider
  )

  useEffect(() => {
    console.log("getting nft data")
    if (Number(id) >= 0)
      fetchNft().then((nft) => {
        setCollectionName(nft.name)
        setResources(nft.allResources)
        setTokenResources(nft.tokenResources)
        setTokenUri(nft.tokenUri)
      })
  }, [id])

  async function fetchNft() {
    const name: string = await multiResourceContract.name()
    const tokenUri: string = await multiResourceContract.tokenURI(id)
    const allResources: string[] = await multiResourceContract.getAllResources()
    const tokenResources: string[] =
      await multiResourceContract.getFullResources(id)
    const allData: string[] = []
    const tokenData: string[] = []
    for (const r of allResources) {
      const resourceData = await multiResourceContract.getResource(r)
      allData.push(resourceData[1])
    }
    for (const r of tokenResources) {
      const resourceData = await multiResourceContract.getResource(r)
      tokenData.push(resourceData[1])
    }
    setAllResourcesData(allData)
    setTokenResourcesData(tokenData)
    return { name, allResources, tokenResources, tokenUri }
  }

  async function addResource() {
    if (signer instanceof Signer) {
      const tx = await multiResourceContract
        .connect(signer)
        .addResourceEntry(1, resourceInput, [])
      addRecentTransaction({
        hash: tx.hash,
        description: "Adding a new resource to RMRK NFT",
        confirmations: 1,
      })
    }
  }

  async function rejectResource(resourceId: number) {
    if (signer instanceof Signer) {
      const tx = await multiResourceContract
        .connect(signer)
        .rejectResource(id, resourceId)
      addRecentTransaction({
        hash: tx.hash,
        description: "Rejecting a resource RMRK NFT",
        confirmations: 1,
      })
    }
  }

  async function addResourceToToken(resourceId: number) {
    if (signer instanceof Signer) {
      const tx = await multiResourceContract
        .connect(signer)
        .addResourceToToken(id, resourceId, 0)
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
      <h5> Collection Resources:</h5>
      {resources.map((resource, index) => {
        return (
          <div className={styles.card} key={index}>
            <p>Resource {resource + ""}</p>
            <code>{allResourcesData[index] + ""}</code>
            <Image
              src={"https://ipfs.io/ipfs/" + allResourcesData[index]}
              width={100}
              height={100}
              alt={""}
            />
            <button
              className="btn btn-secondary ml-2 "
              onClick={() => {
                addResourceToToken(index).then(() => fetchNft())
              }}
            >
              Add resource to token
            </button>
          </div>
        )
      })}

      <div className={styles.card}>
        <p className={styles.description}>Token ID: {id}</p>
        <Image
          src={"https://ipfs.io/ipfs/" + tokenUri}
          width={120}
          height={120}
          alt={""}
        />
        <div>
          <h5> Token Resources:</h5>
          {tokenResources.map((resource, index) => {
            return (
              <div className={styles.card} key={index}>
                <p>Resource {resource + ""}</p>
                <code>{tokenResourcesData[index] + ""}</code>
                <Image
                  src={"https://ipfs.io/ipfs/" + tokenResourcesData[index]}
                  width={100}
                  height={100}
                  alt={""}
                />
                <button
                  className="btn btn-secondary ml-2 "
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
      <p className="mt-4">
        Has to be Owner of the collection to add new resources!
      </p>
    </main>
  )
}

export default MultiResourceNft
