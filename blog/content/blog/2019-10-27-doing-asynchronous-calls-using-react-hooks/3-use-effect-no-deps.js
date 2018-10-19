import React, { useEffect, useState } from "react"

export default function Example() {
  const [result, setResult] = useState()
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
      const doCall = () => fetch("/api/users").then(r => r.text())

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
    [] // highlight-line
  )

  return (
    <>
      {isLoading && <p>Loading data...</p>}
      {error && <p>An error occurred</p>}
      {result && <div>{result}</div>}
    </>
  )
}
