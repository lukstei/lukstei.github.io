import React, { useState } from "react"

export default function Example() {
  const [result, setResult] = useState()
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(true)

  const doCall = () => fetch("/api/users").then(r => r.text()) // highlight-line

  doCall().then(// highlight-line
    r => {// highlight-line
      setIsLoading(false) // highlight-line
      setResult(r) // highlight-line
    }, // highlight-line
    e => {// highlight-line
      setIsLoading(false)// highlight-line
      setError(e) // highlight-line
    } // highlight-line
  ) // highlight-line

  return (
    <>
      {isLoading && <p>Loading data...</p>}
      {error && <p>An error occurred</p>}
      {result && <div>{result}</div>}
    </>
  )
}
