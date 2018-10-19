import React, { useEffect, useState } from "react"

export default function usePromiseOnCallback(f) {
  const [result, setResult] = useState()
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    let subscribed = true

    if (counter > 0) {
      setIsLoading(true)

      f().then(
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
    }

    return function cleanup() {
      subscribed = false
    }
  }, [counter])

  function triggerEffect() {
    setCounter(counter => counter + 1)
  }

  return [result, error, isLoading, triggerEffect]
}
