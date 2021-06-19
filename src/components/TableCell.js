import React from 'react'

import classNames from '../utils/classNames'


const TableCell = ({ data }) => {

  return (
    <div className={classNames(data.classNames.join(' '), {
      'active': data.active,
      'highlight': data.highlight,
    })}>
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
