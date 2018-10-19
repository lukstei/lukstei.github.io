import React from "react"

export default function ShowUser({ userId }) {
  const [result, error, isLoading] = usePromise(// highlight-line
    () => fetch(`/api/users/${userId}`).then(r => r.text()), // highlight-line
    [userId] // highlight-line
  ) // highlight-line

  return (
    <>
      {isLoading && <p>Loading data...</p>}
      {error && <p>An error occurred</p>}
      {result && <div>{result}</div>}
    </>
  )
}
