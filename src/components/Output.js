import React, { useEffect, useRef, useState } from 'react'

import Paper from '@material-ui/core/Paper'

import useStyles from '../styles/output'
import * as utils from '../utils/table'

import Download from './Download'


const Output = ({ outputData, filename }) => {

  const classes = useStyles()

  const tableElement = useRef(null)

  const [data, setData] = useState([])
  const [rows, setRows] = useState([])
  const [cols, setCols] = useState([])

  const MIN_NUM_ROWS = 100
  const MIN_NUM_COLS = 10

  useEffect(() => {
    const newData = []
    outputData.split(/[\r\n|\n]+/).forEach(row => {
      newData.push(row.split(','))
    })
    setData(newData)
    setRows([...Array(Math.max(newData.length, MIN_NUM_ROWS))])
    setCols([...Array(Math.max(newData[0].length, MIN_NUM_COLS))])
  }, [outputData])

  const renderTable = () => {
    return (
      <Paper>
        <div className={classes.tableWrapper}>
          <table ref={element => tableElement.current = element}
            <thead>
              <tr>
                <th scope="col"></th>
                {cols.map((r, i) => (
                  <th scope="col" key={i}>
                    <div>
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
                      return <td key={`cell-${j}`}>{data[i][j]}</td>
                    } else {
                      return <td key={`cell-${j}`} />
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>
    )
  }

  const renderButton = () => {
    return (
      <Download
        filename={filename}
        data={outputData} />
    )
  }

  return (
    <React.Fragment>
      {renderTable()}
      {renderButton()}
    </React.Fragment>
  )
}


export default Output
