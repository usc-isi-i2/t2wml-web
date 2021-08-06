import React from 'react'

import classNames from '../utils/classNames'


const TableCell = ({ cellData, rowIndex, columnIndex }) => {

  const data = cellData[1]

  return (
    <div className={classNames(data.classNames.join(' '), {
      'active': data.active,
      'highlight': data.highlight,
      'maxWidth': data.maxWidth,
      'qnode': (data.activeTop || data.activeRight || data.activeBottom || data.activeLeft) && !!data.qnode,
    })} data-row-index={rowIndex+1} data-col-index={columnIndex}>
      {data.value}
      {data.activeTop && <div className="cell-border-top" />}
      {data.activeLeft && <div className="cell-border-left" />}
      {data.activeRight && <div className="cell-border-right" />}
      {data.activeBottom && <div className="cell-border-bottom" />}
      {data.activeCorner && <div className="cell-resize-corner" />}
    </div>
  )
}


export default TableCell
