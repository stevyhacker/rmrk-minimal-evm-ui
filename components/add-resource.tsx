import React from "react"

function AddResourceToCollection(props: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick: () => void
}) {
  return (
    <>
      <input
        inputMode="text"
        placeholder="Resource metadata URI"
        className="input input-bordered w-full max-w-xs mt-4 mb-2"
        value={props.value}
        onChange={props.onChange}
      ></input>
      <button className="btn btn-primary mt-2" onClick={props.onClick}>
        Add New Resource
      </button>
    </>
  )
}

export default AddResourceToCollection