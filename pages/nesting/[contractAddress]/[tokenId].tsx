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
import ChildNft from "../../../components/child-nft"
import AddResourceToCollection from "../../../components/add-resource"

const NestingNft = () => {
  const provider = useProvider()
  const { data: signer } = useSigner()
  const addRecentTransaction = useAddRecentTransaction()
  const router = useRouter()
  const query: string[] = router.asPath.split("/")
  const contractAddress = query[2]
  const tokenId = query[3]
  const [resourceInput, setResourceInput] = useState<string>("")
  const [tokenOwner, setTokenOwner] = useState<string>("")
  const [tokenUri, setTokenUri] = useState<string>("")
  const [collectionName, setCollectionName] = useState<string>("")
  const [resources, setResources] = useState<string[]>([])
  const [childrenTokens, setChildrenTokens] = useState<
    { tokenId: string; tokenUri: any }[]
  >([])
  const [pendingChildren, setPendingChildren] = useState<
    { tokenId: string; tokenUri: any }[]
  >([])
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
  }, [signer, contractAddress, tokenId])

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
    const pendingChildrenNfts = []
    const childrenNfts = []
    const nftSupply = await nestingContract.totalSupply()
    const nftOwner = await nestingContract.ownerOf(tokenId)

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
    for (const c of pendingChildren) {
      pendingChildrenNfts.push({
        tokenId: c.toString().split(",")[0],
        tokenUri: await nestingContract.tokenURI(c.toString().split(",")[0]),
      })
    }
    for (const c of children) {
      childrenNfts.push({
        tokenId: c.toString().split(",")[0],
        tokenUri: await nestingContract.tokenURI(c.toString().split(",")[0]),
      })
    }
    setTokenOwner(nftOwner)
    setAllResourcesData(allData)
    setPendingResourcesData(pendingResourcesData)
    setActiveResourcesData(activeResourcesData)
    setChildrenTokens(childrenNfts)
    setPendingChildren(pendingChildrenNfts)
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
      await tx.wait(1)
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
      await tx.wait(1)
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
      await tx.wait(1)
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
      await tx.wait(1)
    }
  }

  async function addChildToToken(childTokenId: number) {
    if (signer instanceof Signer) {
      const tx = await nestingContract
        .connect(signer)
        .nestTransfer(contractAddress, childTokenId, tokenId)
      addRecentTransaction({
        hash: tx.hash,
        description: "Transferring child token into this NFT",
        confirmations: 1,
      })
      await tx.wait(1)
    }
  }

  function handleResourceInput(e: React.ChangeEvent<HTMLInputElement>) {
    setResourceInput(e.target.value)
  }

  async function acceptChild(index: number) {
    if (signer instanceof Signer) {
      const tx = await nestingContract
        .connect(signer)
        .acceptChild(tokenId, index)
      addRecentTransaction({
        hash: tx.hash,
        description: "Accepting child for this NFT",
        confirmations: 1,
      })
      await tx.wait(1)
    }
  }

  async function rejectChild(index: number) {
    if (signer instanceof Signer) {
      const tx = await nestingContract
        .connect(signer)
        .rejectChild(tokenId, index)
      addRecentTransaction({
        hash: tx.hash,
        description: "Rejecting child for this NFT",
        confirmations: 1,
      })
      await tx.wait(1)
    }
  }

  async function removeChild(childId: number, index: number) {
    if (signer instanceof Signer) {
      const tx = await nestingContract
        .connect(signer)
        .removeChild(tokenId, index)
        // .unnestChild(tokenId, childId, index)
      addRecentTransaction({
        hash: tx.hash,
        description: "Removing child from this NFT",
        confirmations: 1,
      })
      await tx.wait(1)
    }
  }

  return (
    <main className={styles.main}>
      <ConnectButton />

      <h4 className={styles.description}>Collection name: {collectionName}</h4>
      <ul className="my-1 font-bold">Usage Notes:</ul>
      <li>
        You have to be the <b>Owner</b> of the NFT or Approved to accept or
        reject a resource
      </li>
      <li>
        You have to be the <b>Owner</b> of the NFT Collection to add new
        resources
      </li>
      <li>
        You have to be the <b>Owner</b> of the NFT to accept and reject a child
        or to nest into an NFT.
      </li>
      <li className="mb-2">
        If you are not authorized like above the transactions will be reverted
      </li>
      <div className={styles.nft}>
        <p className={styles.description}>Token ID: {tokenId}</p>
        <p className="">Token Owner: </p>
        <code className="">{tokenOwner}</code>
        <p className="mt-1">Token URI: </p>
        <code>{tokenUri}</code>
        <div className="mt-2">
          <Image
            src={"https://ipfs.io/ipfs/" + tokenUri}
            width={120}
            height={120}
            alt={""}
          />
        </div>

        <div>
          <div className="bg-gray-200 p-0.5 rounded-lg">
            <h1 className="text-center text-xl mt-5"> Token Children:</h1>
            {childrenTokens.length > 0 ? (
              childrenTokens.map((child, index) => {
                return (
                  <>
                    <ChildNft
                      key={index}
                      uriComponent={contractAddress}
                      child={child}
                    />
                    <button
                      className="btn btn-secondary btn-sm ml-2 "
                      onClick={() => {
                        removeChild(Number(child.tokenId), index).then((r) =>
                          fetchNft()
                        )
                      }}
                    >
                      Remove child
                    </button>
                  </>
                )
              })
            ) : (
              <p>0</p>
            )}
            <h1 className="text-center text-xl mt-5">
              Token Pending Children:
            </h1>
            {pendingChildren.length > 0 ? (
              pendingChildren.map((child, index) => {
                return (
                  <>
                    <ChildNft
                      key={index}
                      uriComponent={contractAddress}
                      child={child}
                    />
                    <button
                      className="btn btn-primary btn-sm mb-2 "
                      onClick={() => {
                        acceptChild(index).then((r) => fetchNft())
                      }}
                    >
                      Accept child
                    </button>
                    <button
                      className="btn btn-secondary btn-sm ml-2 "
                      onClick={() => {
                        rejectChild(index).then((r) => fetchNft())
                      }}
                    >
                      Reject child
                    </button>
                  </>
                )
              })
            ) : (
              <p>0</p>
            )}
          </div>
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
                        addChildToToken(nft.tokenId).then((r) => fetchNft())
                      }}
                    >
                      Nest into token id {tokenId}
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
      <AddResourceToCollection
        value={resourceInput}
        onChange={handleResourceInput}
        onClick={() => {
          addResource().then(() => fetchNft())
        }}
      />
    </main>
  )
}

export default NestingNft
