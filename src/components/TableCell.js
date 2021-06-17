import React from 'react'


const TableCell = ({ data }) => {
  return (
    <td className={[...data.classNames]}>
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
