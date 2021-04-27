import React, { useEffect, useRef, useState } from 'react'

import Paper from '@material-ui/core/Paper'

import useStyles from '../styles/output'
import * as utils from '../utils/table'


const Output = ({ data, filename }) => {

  const classes = useStyles()

  const tableElement = useRef(null)

  const [rows, setRows] = useState([])
  const [cols, setCols] = useState([])

  const MIN_NUM_ROWS = 100
  const MIN_NUM_COLS = 10

  useEffect(() => {
    setRows([...Array(Math.max(data.length, MIN_NUM_ROWS))])
    setCols([...Array(Math.max(data[0].length, MIN_NUM_COLS))])
  }, [data])

  const intervalID = useRef(null)
  const [activeCol, setActiveCol] = useState()
  const NUDGE_INTERVAL = 3000 // ms

  useEffect(() => {
    // component did mount
    intervalID.current = setInterval(() => {
      if ( data.length < 2 ) { return }
      let counter = 0
      while ( counter < data[0].length ) {
        if ( !data[1][counter] ) {
          setActiveCol(data[0][counter])
          break
        }
        counter += 1
      }
    }, NUDGE_INTERVAL)

    // component will unmount
    return () => {
      clearInterval(intervalID.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      <Paper>
        <div className={classes.tableWrapper}>
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
                    const classNames = []
                    if ( data[0][j] === activeCol ) {
                      classNames.push('active')
                    }
                    if ( i < data.length && j < data[i].length && data[i][j] ) {
                      return (
                        <td key={`cell-${j}`} className={classNames}>
                          {data[i][j]}
                        </td>
                      )
                    } else {
                      return <td key={`cell-${j}`} className={classNames} />
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

  return (
    <React.Fragment>
      {renderTable()}
    </React.Fragment>
  )
}


export default Output
