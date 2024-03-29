import React, { useEffect, useRef, useState } from 'react'

import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import classNames from '../utils/classNames'
import useStyles from '../styles/output'
import * as utils from '../utils/table'


const Output = ({ data, filename, loading }) => {

  const classes = useStyles()

  const tableElement = useRef(null)

  const [rows, setRows] = useState([])
  const [cols, setCols] = useState([])

  const MIN_NUM_ROWS = 100
  const MIN_NUM_COLS = 26

  useEffect(() => {
    setRows([...Array(Math.max(data.length, MIN_NUM_ROWS))])
    setCols([...Array(Math.max(data[0].length, MIN_NUM_COLS))])
  }, [data])

  const handleOnClickHeader = event => {
    const element = event.target
    element.setAttribute('style', 'width: 100%')
    element.parentElement.setAttribute('style', 'max-width: 1%')

    const rows = tableElement.current.querySelectorAll('tr')
    const index = element.parentElement.cellIndex
    rows.forEach(row => {
      row.children[index].setAttribute('style', 'max-width: 1%')
    })

    setTimeout(() => {
      element.setAttribute('style', `min-width: ${element.clientWidth}px`)
    }, 100)
  }

  const renderTable = () => {
    return (
      <Paper className={classNames(classes.tableWrapper, {loading})}>
        <table ref={element => tableElement.current = element}>
          <thead>
            <tr>
              <th scope="col"></th>
              {cols.map((r, i) => (
                <th scope="col" key={i}>
                  <div onDoubleClick={handleOnClickHeader}>
                    {utils.columnToLetter(i + 1)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((e, i) => (
              <tr key={`row-${i}`}>
                <td>{i + 1}</td>
                {cols.map((r, j) => {
                  if ( i < data.length && j < data[i].length && data[i][j] ) {
                    return (
                      <td key={`cell-${j}`}>
                        {data[i][j]}
                      </td>
                    )
                  } else {
                    return <td key={`cell-${j}`}/>
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>
    )
  }

  const renderLoading = () => {
    if ( !loading ) { return }
    return (
      <CircularProgress
        size={50}
        color="inherit"
        className={classes.loading} />
    )
  }

  return (
    <React.Fragment>
      {renderTable()}
      {renderLoading()}
    </React.Fragment>
  )
}


export default Output
