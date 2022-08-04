import Image from "next/image"
import React from "react"

export default function Resource(props: {
  resource: string
  strings: string[]
  index: number
}) {
  return (
    <div>
      <p>Resource ID: {props.resource + ""}</p>
      <p className="text-sm mt-1">Token URI:</p>
      <code className="text-sm mb-10">
        {props.strings[props.index][1] + ""}
      </code>
      <br />
      <Image
        src={"https://ipfs.io/ipfs/" + props.strings[props.index][1]}
        width={100}
        height={100}
        alt={""}
      />
      <br />
      {/*{props.strings[props.index][2].length>0 && (*/}
      {/*  <div>*/}
      {/*    <p className="text-sm mt-1">Custom data:</p>*/}
      {/*    <code className="text-sm">{props.strings[props.index][2] + ""}</code>*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  )
}
