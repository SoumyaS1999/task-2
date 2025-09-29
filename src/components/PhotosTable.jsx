import React, { useMemo, useEffect, useRef, useState } from 'react'
import PhotoRow from './PhotoRow'

const cellStyle = { border: '1px solid #ddd', padding: '8px', textAlign: 'left' }
const headerCellStyle = { ...cellStyle, position: 'sticky', top: 0, background: '#fff', zIndex: 1 }

export default function PhotosTable({ photos }) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(t)
  }, [query])

  const filteredPhotos = useMemo(() => {
    if (!debouncedQuery) return photos
    const q = debouncedQuery.toLowerCase()
    return photos.filter(p => (p.title || '').toLowerCase().includes(q))
  }, [photos, debouncedQuery])

  const rowHeight = 70
  const containerRef = useRef(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(600)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const setSize = () => setContainerHeight(el.clientHeight || 600)
    setSize()
    let ro
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => setSize())
      ro.observe(el)
    } else {
      const handle = () => setSize()
      window.addEventListener('resize', handle)
      return () => window.removeEventListener('resize', handle)
    }
    return () => { if (ro) ro.disconnect() }
  }, [])

  const totalRows = filteredPhotos.length
  const overscan = 8
  const effectiveScrollTop = Math.max(0, scrollTop)
  const viewportHeight = Math.max(0, containerHeight)
  const startIndex = Math.max(0, Math.floor(effectiveScrollTop / rowHeight) - overscan)
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2
  const endIndex = Math.min(totalRows - 1, startIndex + visibleCount - 1)
  const itemsToRender = filteredPhotos.slice(startIndex, endIndex + 1)

  return (
    <div className='p-4 sm:p-6'>
      <div className='flex items-center gap-2 mb-3'>
        <input
          type='text'
          placeholder='Search by title...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='border border-gray-300 rounded px-3 py-1 text-sm w-72'
        />
        <div className='text-gray-600 text-xs'>{filteredPhotos.length} / {photos.length}</div>
      </div>
      <div ref={containerRef} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)} className='overflow-y-auto overflow-x-hidden max-h-[80vh] border border-gray-200 rounded shadow-sm'>
        <table className='w-full table-fixed border-collapse'>
          <thead className='bg-white sticky top-0 z-10'>
            <tr>
              <th style={headerCellStyle}>Album ID</th>
              <th style={headerCellStyle}>ID</th>
              <th style={headerCellStyle}>Title</th>
              <th style={headerCellStyle}>Thumbnail</th>
              <th style={headerCellStyle}>URL</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ height: startIndex * rowHeight }}><td colSpan={5} style={{ padding: 0, border: 'none' }} /></tr>
            {itemsToRender.map((photo, localIdx) => (
              <PhotoRow
                key={photo.id}
                photo={photo}
                rowIndex={startIndex + localIdx}
                absoluteIndex={startIndex + localIdx}
                rowHeight={rowHeight}
              />
            ))}
            <tr style={{ height: (totalRows - (endIndex + 1)) * rowHeight }}><td colSpan={5} style={{ padding: 0, border: 'none' }} /></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

