import React, { useState } from "react"

export default function ShowUser({userId}) {
    const [result, error, isLoading] = usePromise(
        () => fetch(`/api/users/${userId}`).then(r => r.text()),
        [userId]
    )

    const [counter, setCounter] = useState(0)// highlight-line

    usePromise(() => {
            if (counter > 0) {// highlight-line
                return fetch(`/api/users/${userId}`, {method: "DELETE"})
            }
            return Promise.resolve()
        },
        [counter]// highlight-line
    )

    const deleteUser = () => {
        setCounter(counter => counter + 1)// highlight-line
    }

    return (
        <>
            {isLoading && <p>Loading data...</p>}
            {error && <p>An error occurred</p>}
            {result && (
                <>
                    <div>{result}</div>
                    <button onClick={deleteUser}>Delete user {userId}</button>
                </>
            )}
        </>
    )
}
