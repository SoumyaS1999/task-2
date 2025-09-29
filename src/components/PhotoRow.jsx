import React, { memo } from 'react'

const cellStyle = { border: '1px solid #ddd', padding: '8px', textAlign: 'left' }

function PhotoRowComponent({ photo, rowIndex, absoluteIndex, rowHeight = 70 }) {
  const rowStyle = { height: rowHeight }
  const baseRowClass = rowIndex % 2 === 1 ? 'bg-gray-50' : 'bg-white'
  return (
    <tr className={`${baseRowClass} hover:bg-gray-100 transition-colors`} style={rowStyle}>
      <td style={cellStyle}>{photo.albumId}</td>
      <td style={cellStyle}>{photo.id}</td>
      <td style={cellStyle}>{photo.title}</td>
      <td style={{ ...cellStyle }}>
        <div style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f3f3', color: '#444', fontSize: 10 }}>img {absoluteIndex + 1}</div>
      </td>
      <td style={cellStyle}>
        <a href={photo.url} target='_blank' rel='noreferrer' className='text-gray-700 hover:text-blue-600'>
          {photo.url}
        </a>
      </td>
    </tr>
  )
}

const PhotoRow = memo(PhotoRowComponent)
export default PhotoRow

