import React from "react"

export default function ShowUser({ userId }) {
  const [result, error, isLoading] = usePromise(
    () => fetch(`/api/users/${userId}`).then(r => r.text()),
    [userId]
  )

  const [, deleteError, isDeleting, triggerDelete] = usePromiseOnCallback(// highlight-line
    () => fetch(`/api/users/${userId}`, { method: "DELETE" }) // highlight-line
  ) // highlight-line

  return (
    <>
      {isLoading && <p>Loading data...</p>}
      {error && <p>An error occurred</p>}
      {result && (
        <>
          <div>{result}</div>
          <button onClick={triggerDelete}>Delete user {userId}</button>{/* highlight-line */}
        </>
      )}
    </>
  )
}
