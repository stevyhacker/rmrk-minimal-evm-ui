import { useRouter } from "next/router"
import styles from "../../styles/Home.module.css"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { Button, List, TextField } from "@mui/material"
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
  const [allResourcesData, setAllResourcesData] = useState<string[]>([])
  const multiResourceContract = new Contract(
    rmrkMultiResourceContract.addressOrName,
    rmrkMultiResourceContract.contractInterface,
    provider
  )

  useEffect(() => {
    console.log("getting nft data")
    fetchNft().then((nft) => {
      setCollectionName(nft.name)
      setResources(nft.allResources)
    })
  }, [])

  async function fetchNft() {
    const allResources: string[] = await multiResourceContract.getAllResources()
    const d: string[] = []
    for (const r of allResources) {
      const resourceData = await multiResourceContract.getResource(r)
      d.push(resourceData[1])
      setAllResourcesData(d)
      console.log("allResources: " + resourceData)
    }
    const name: string = await multiResourceContract.name()
    return { name, allResources }
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

  function handleResourceInput(e: React.ChangeEvent<HTMLInputElement>) {
    setResourceInput(e.target.value)
  }

  return (
    <main className={styles.main}>
      <ConnectButton />

      <h4 className={styles.description}>Collection name: {collectionName}</h4>
      <p className={styles.description}>Token ID: {id}</p>
      <Image
        src={"https://ipfs.io/ipfs/" + tokenUri}
        width={120}
        height={120}
        alt={""}
      />
      <List>
        {resources.map((resource, index) => {
          return (
            <div className={styles.card} key={index}>
              <p>Resource {resource + ""}</p>
              <code>{allResourcesData[index] + ""}</code>
              <Image
                src={"https://ipfs.io/ipfs/" + allResourcesData[index]}
                width={80}
                height={80}
                alt={""}
              />
              <Button
                onClick={() => {
                  rejectResource(index).then(() => fetchNft())
                }}
              >
                Reject Resource
              </Button>
            </div>
          )
        })}
      </List>
      <TextField
        inputMode={"text"}
        placeholder="metadataURI"
        value={resourceInput}
        onChange={handleResourceInput}
      ></TextField>
      <Button
        onClick={() => {
          addResource().then(() => fetchNft())
        }}
      >
        Add New Resource
      </Button>
      <p>Has to be Owner of the collection to add new resources!</p>
    </main>
  )
}

export default MultiResourceNft
