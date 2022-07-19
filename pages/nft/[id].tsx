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
  const [pendingResources, setPendingResources] = useState<string[]>([])
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
        setPendingResources(nft.pendingResources)
        setTokenUri(nft.tokenUri)
      })
  }, [id])

  async function fetchNft() {
    const name: string = await multiResourceContract.name()
    const tokenUri: string = await multiResourceContract.tokenURI(id)
    const allResources: string[] = await multiResourceContract.getAllResources()
    const pendingResources: string[] =
      await multiResourceContract.getPendingResources(id)
    const allData: string[] = []
    const tokenData: string[] = []
    for (const r of allResources) {
      const resourceData = await multiResourceContract.getResource(r)
      allData.push(resourceData[1])
    }
    for (const r of pendingResources) {
      const resourceData = await multiResourceContract.getResource(r)
      tokenData.push(resourceData[1])
    }
    setAllResourcesData(allData)
    setTokenResourcesData(tokenData)
    return { name, allResources, pendingResources, tokenUri }
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
      <div className={styles.nft}>
        <p className={styles.description}>Token ID: {id}</p>
        <Image
          src={"https://ipfs.io/ipfs/" + tokenUri}
          width={50}
          height={50}
          alt={""}
        />
        <div>
          <h1 className="text-center text-xl"> Token Active Resources:</h1>
          <h1 className="text-center text-xl mt-5">
            {" "}
            Token Pending Resources:
          </h1>
          {pendingResources.map((resource, index) => {
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

      <p className="text-center text-2xl mt-10">NFT Collection Resources:</p>
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
