import React, { useEffect, useState } from "react"

export default function ShowUser({ userId }) {
  const [result, setResult] = useState()
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const doCall = () => fetch(`/api/users/${userId}`).then(r => r.text())

    let subscribed = true
    setIsLoading(true)

    doCall().then(
      r => {
        if (subscribed) {
          setIsLoading(false)
          setResult(r)
        }
      },
      e => {
        if (subscribed) {
          setIsLoading(false)
          setError(e)
        }
      }
    )

    return function cleanup() {// highlight-line
      subscribed = false // highlight-line
    } // highlight-line
  }, [userId])

  return (
    <>
      {isLoading && <p>Loading data...</p>}
      {error && <p>An error occurred</p>}
      {result && <div>{result}</div>}
    </>
  )
}