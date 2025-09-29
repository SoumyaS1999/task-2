import React, {useRef, Suspense} from 'react'
import { createResource } from './utils/createResource'
import ErrorBoundary from './components/ErrorBoundary'
import PhotosTable from './components/PhotosTable'

const App = () => {
  const resourceRef = useRef(null)
  if (!resourceRef.current) {
    resourceRef.current = createResource(
      fetch('https://jsonplaceholder.typicode.com/photos').then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
    )
  }

  return (
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <PhotosBody resource={resourceRef.current} />
        </Suspense>
      </ErrorBoundary>
  )
}

function PhotosBody({ resource }) {
  const photos = resource.read()
  return <PhotosTable photos={photos} />
}

export default App
