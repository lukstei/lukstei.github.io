import React, { useEffect, useState } from "react"

export default function ShowUser({ userId }) {
  const [result, setResult] = useState()
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
      const doCall = () => fetch(`/api/users/${userId}`).then(r => r.text())

      setIsLoading(true)

      doCall().then(
        r => {
          setIsLoading(false)
          setResult(r)
        },
        e => {
          setIsLoading(false)
          setError(e)
        }
      )
    },
    [userId] // highlight-line
  )

  return (
    <>
      {isLoading && <p>Loading data...</p>}
      {error && <p>An error occurred</p>}
      {result && <div>{result}</div>}
    </>
  )
}
