---
title: Test article
draft: true
---



```bash
/usr/bin/env python3 /apps/services/job-wrapper/job-wrapper.py backup-photos /apps/services/job-backup/backup.sh ssh://my-storage-box:23/./vps-1-photos /media/data/photos
```


```jsx
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
    [] 
  )

  return (
    <>
      {isLoading && <p>Loading data...</p>}
      {error && <p>An error occurred</p>}
      {result && <div>{result}</div>}
    </>
  )
}
```


{{< highlight go "linenos=table,hl_lines=8 15-17,linenostart=199" >}}
// GetTitleFunc returns a func that can be used to transform a string to
// title case.
//
// The supported styles are
//
// - "Go" (strings.Title)
// - "AP" (see https://www.apstylebook.com/)
// - "Chicago" (see https://www.chicagomanualofstyle.org/home.html)
//
// If an unknown or empty style is provided, AP style is what you get.
func GetTitleFunc(style string) func(s string) string {
  switch strings.ToLower(style) {
  case "go":
    return strings.Title
  case "chicago":
    return transform.NewTitleConverter(transform.ChicagoStyle)
  default:
    return transform.NewTitleConverter(transform.APStyle)
  }
}
{{< / highlight >}}
