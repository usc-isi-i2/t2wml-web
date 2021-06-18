import React from 'react'


const TableCell = ({ data }) => {

  if ( data.active && !data.classNames.includes('active') ) {
    data.classNames.push('active')
  }
  if ( !data.active ) {
    data.classNames.splice(1, data.classNames.indexOf('active'))
  }

  return (
    <td className={data.classNames.join(' ')}>
      {data.value}
      {data.activeTop && <div className="cell-border-top" />}
      {data.activeLeft && <div className="cell-border-left" />}
      {data.activeRight && <div className="cell-border-right" />}
      {data.activeBottom && <div className="cell-border-bottom" />}
      {data.activeCorner && <div className="cell-resize-corner" />}
    </td>
  )
}


export default TableCell
