import React from "react"

export default function ShowUser({userId}) {
    const [result, error, isLoading] = usePromise(
        () => fetch(`/api/users/${userId}`).then(r => r.text()),
        [userId]
    )

    const deleteUser = userId => {// highlight-line
        console.log(`Deleting user ${userId}`)// highlight-line
        ...// highlight-line
    }// highlight-line

    return (
        <>
            {isLoading && <p>Loading data...</p>}
            {error && <p>An error occurred</p>}
            {result && (
                <>
                    <div>{result}</div>
                    <button onClick={() => deleteUser(userId)}>{/* highlight-line */}
                        Delete user {userId}
                    </button>
                </>
            )}
        </>
    )
}
