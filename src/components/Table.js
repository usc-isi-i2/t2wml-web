import React, { useEffect, useRef, useState } from 'react'

import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import AnnotationMenu from './AnnotationMenu'
import * as utils from '../utils/table'


const useStyles = makeStyles(theme => ({
  tableWrapper: {
    position: 'relative',
    overflow: 'scroll',
    width: '100vw',
    height: '100vh',
    '& table': {
      tableLayout: 'fixed',
      transform:'rotateX(0deg)',
      border: '1px solid #c7c7c7',
      borderCollapse: 'collapse',
      borderSpacing: '0',
      fontWeight: '400',
      userSelect: 'none',
      position: 'relative',
      cursor: 'crosshair',
      '& th:nth-child(1)': {
        padding: '0.15em 0.5em',
        textAlign: 'center',
        background: theme.palette.type === 'dark' ? '#333' : '#f9f9f9',
        color: theme.palette.type === 'dark' ? '#fefefe' : '#777',
        minWidth: '1em',
        position: 'sticky',
        zIndex: '5',
        left: '-1px',
        top: '-1px',
        boxShadow: 'inset -1px 0px 0px 0px #c7c7c7',
        pointerEvents: 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: '2px',
          right: '2px',
          width: '0',
          height: '0',
          borderLeft: '1.25em solid transparent',
          borderRight: theme.palette.type === 'dark' ? (
            '1.25em solid #fefefe'
          ) : (
            '1.25em solid #ddd'
          ),
          borderTop: '1.25em solid transparent',
          pointerEvents: 'none',
        },
      },
      '& thead tr th': {
        border: '1px solid #c7c7c7',
        whiteSpace: 'nowrap',
        minWidth: '75px',
        textAlign: 'center',
        background: theme.palette.type === 'dark' ? '#333' : '#f9f9f9',
        color: theme.palette.type === 'dark' ? '#fefefe' : '#777',
        position: 'sticky',
        zIndex: '3',
        width: '75px',
        top: '-1px',
      },
      '& thead tr th::after': {
        content: '""',
        display: 'block',
        left: '0',
        right: '0',
        bottom: '0',
        height: '1px',
        position: 'absolute',
        background: '#c7c7c7',
      },
      '& thead tr th > div': {
        padding: '0.15em 0.5em',
        width: '75px',
        minWidth: '75px',
        height: '1.25em',
        resize: 'horizontal',
        overflow: 'hidden',
        display: 'inline-table',
      },
      '& tr td:nth-child(1)': {
        textAlign: 'center',
        background: theme.palette.type === 'dark' ? '#333' : '#f9f9f9',
        color: theme.palette.type === 'dark' ? '#fefefe' : '#777',
        padding: '0.15em 0.5em',
        minWidth: '1em',
        position: 'sticky',
        zIndex: '3',
        left: '-1px',
        pointerEvents: 'none',
      },
      '& tr td:nth-child(1)::after': {
        content: '""',
        display: 'block',
        top: '0',
        right: '0',
        bottom: '0',
        width: '1px',
        position: 'absolute',
        background: '#c7c7c7',
        pointerEvents: 'none',
      },
      '& tr td': {
        color: theme.palette.type === 'dark' ? '#ddd' : '#111',
        border: '1px solid #c7c7c7',
        padding: '0.15em 0.5em',
        lineHeight: '1.25em',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        position: 'relative',
        minWidth: '75px',
        maxWidth: '75px',
        width: '75px',
        zIndex: '1',
        '& div.cell-border-top': {
          display: 'block',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '1px',
          pointerEvents: 'none',
          background: theme.palette.type === 'dark' ? '#fefefe' : '#555',
          zIndex: '5',
        },
        '&.active div.cell-border-top': {
          height: '2px',
        },
        '& div.cell-border-left': {
          display: 'block',
          position: 'absolute',
          top: '0',
          left: '0',
          bottom: '0',
          width: '1px',
          pointerEvents: 'none',
          background: theme.palette.type === 'dark' ? '#fefefe' : '#555',
          zIndex: '5',
        },
        '&.active div.cell-border-left': {
          width: '2px',
        },
        '& div.cell-border-right': {
          display: 'block',
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          width: '1px',
          pointerEvents: 'none',
          background: theme.palette.type === 'dark' ? '#fefefe' : '#555',
          zIndex: '5',
        },
        '&.active div.cell-border-right': {
          width: '2px',
        },
        '& div.cell-border-bottom': {
          display: 'block',
          position: 'absolute',
          left: '0',
          right: '0',
          bottom: '0',
          height: '1px',
          pointerEvents: 'none',
          background: theme.palette.type === 'dark' ? '#fefefe' : '#555',
          zIndex: '5',
        },
        '&.active div.cell-border-bottom': {
          height: '2px',
        },
        '& div.cell-resize-corner': {
          display: 'block',
          position: 'absolute',
          right: '-2px',
          bottom: '-2px',
          width: '9px',
          height: '9px',
          cursor: 'pointer',
          background: theme.palette.type === 'dark' ? '#fefefe' : '#555',
          border: theme.palette.type === 'dark' ? '1px solid #555' : '1px solid #fefefe',
          zIndex: '25',
        },
      },
      '&.active tr td': {
        opacity: '0.5',
        '&.active': {
           opacity: '1',
        },
      },
    },
  },
}))


const Table = ({ data }) => {

  const classes = useStyles()

  const selection = useRef(null)
  const prevElement = useRef(null)
  const tableElement = useRef(null)
  const prevDirection = useRef(null)
  const [userSelecting, setUserSelecting] = useState(false)
  const [showAnnotationMenu, setShowAnnotationMenu] = useState(false)
  const [selectedAnnotationBlock, setSelectedAnnotationBlock] = useState()

  const MIN_NUM_ROWS = 100
  const rows = [...Array(Math.max(data.length, MIN_NUM_ROWS))]
  const cols = [...Array(Math.max(data[0].length, 26))]

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

  useEffect(() => {
    // component did mount
    document.addEventListener('keydown', handleOnKeyDown)
    document.addEventListener('mouseup', handleOnMouseUp)

    // component will unmount
    return () => {
      document.removeEventListener('keydown', handleOnKeyDown)
      document.removeEventListener('mouseup', handleOnMouseUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOnKeyDown = event => {

    // Close annotation menu with ESC key
    if ( event.code === 'Escape' ) {
      hideAnnotationMenu()
    }

    const arrowKeyCodes = [
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
    ]
    if ( arrowKeyCodes.includes(event.code) && selection.current ) {

      // Don't allow moving around when users are typing
      if ( (event.target).nodeName === 'INPUT' ) { return }

      // Prevent scroll with arrow keys
      event.preventDefault()

      const { x1, x2, y1, y2 } = selection.current
      const rows = tableElement.current.querySelectorAll('tr')

      // arrow up
      if ( event.code === 'ArrowUp' && y1 > 1 ) {

        // extend selection with shift key
        if ( event.shiftKey ) {
          if ( y1 === y2 ) {
            selection.current = {'x1': x1, 'x2': x2, 'y1': y1 - 1, 'y2': y2}
            prevDirection.current = 'up'
          } else {
            if ( prevDirection.current === 'down' ) {
              selection.current = {'x1': x1, 'x2': x2, 'y1': y1, 'y2': y2 - 1}
            } else {
              selection.current = {'x1': x1, 'x2': x2, 'y1': y1 - 1, 'y2': y2}
              prevDirection.current = 'up'
            }
          }
        } else {
          selection.current = {'x1': x1, 'x2': x1, 'y1': y1 - 1, 'y2': y1 - 1}
          const nextElement = rows[y1 - 1].children[x1]
          prevElement.current = nextElement
        }
      }

      // arrow down
      if ( event.code === 'ArrowDown' && y1 < rows.length - 1 ) {
        if ( event.shiftKey ) {
          if ( y1 === y2 ) {
            selection.current = {'x1': x1, 'x2': x2, 'y1': y1, 'y2': y2 + 1}
            prevDirection.current = 'down'
          } else {
            if ( prevDirection.current === 'up' ) {
              selection.current = {'x1': x1, 'x2': x2, 'y1': y1 + 1, 'y2': y2}
            } else {
              selection.current = {'x1': x1, 'x2': x2, 'y1': y1, 'y2': y2 + 1}
              prevDirection.current = 'down'
            }
          }
        } else {
          selection.current = {'x1': x1, 'x2': x1, 'y1': y1 + 1, 'y2': y1 + 1}
          const nextElement = rows[y1 + 1].children[x1]
          prevElement.current = nextElement
        }
      }

      // arrow left
      if ( event.code === 'ArrowLeft' && x1 > 1 ) {
        if ( event.shiftKey ) {
          if ( x1 === x2 ) {
            selection.current = {'x1': x1 - 1, 'x2': x2, 'y1': y1, 'y2': y2}
            prevDirection.current = 'left'
          } else {
            if ( prevDirection.current === 'right' ) {
              selection.current = {'x1': x1, 'x2': x2 - 1, 'y1': y1, 'y2': y2}
            } else {
              selection.current = {'x1': x1 - 1, 'x2': x2, 'y1': y1, 'y2': y2}
              prevDirection.current = 'left'
            }
          }
        } else {
          selection.current = {'x1': x1 - 1, 'x2': x1 - 1, 'y1': y1, 'y2': y1}
          const nextElement = rows[y1].children[x1 - 1]
          prevElement.current = nextElement
        }
      }

      // arrow right
      if (event.code === 'ArrowRight' && x1 < rows[y1].children.length - 1) {
        if ( event.shiftKey ) {
          if ( x1 === x2 ) {
            selection.current = {'x1': x1, 'x2': x2 + 1, 'y1': y1, 'y2': y2}
            prevDirection.current = 'right'
          } else {
            if ( prevDirection.current === 'left' ) {
              selection.current = {'x1': x1 + 1, 'x2': x2, 'y1': y1, 'y2': y2}
            } else {
              selection.current = {'x1': x1, 'x2': x2 + 1, 'y1': y1, 'y2': y2}
              prevDirection.current = 'right'
            }
          }
        } else {
          selection.current = {'x1': x1 + 1, 'x2': x1 + 1, 'y1': y1, 'y2': y1}
          const nextElement = rows[y1].children[x1 + 1]
          prevElement.current = nextElement
        }
      }

      // Update Selections
      updateSelections()
    }
  }

  const resetSelection = () => {
    tableElement.current.classList.remove('active')
    tableElement.current.querySelectorAll('td[class*="active"]').forEach(e => {
      e.classList.forEach(className => {
        if (className.startsWith('active')) {
          e.classList.remove(className)
        }
      })
    })
    tableElement.current.querySelectorAll('.cell-border-top').forEach(e => e.remove())
    tableElement.current.querySelectorAll('.cell-border-left').forEach(e => e.remove())
    tableElement.current.querySelectorAll('.cell-border-right').forEach(e => e.remove())
    tableElement.current.querySelectorAll('.cell-border-bottom').forEach(e => e.remove())
    tableElement.current.querySelectorAll('.cell-resize-corner').forEach(e => e.remove())
  }

  const resetEmptyCells = (x1, x2, y1, y2) => {
    if ( !selection.current ) { return }

    const rows = tableElement.current.querySelectorAll('tr')
    rows.forEach((row, index) => {
      if ( selection.current.y1 < selection.current.y2 ) {
        if ( index >= selection.current.y1 && index <= selection.current.y2 ) {
          // reset cell class names on the vertical axes
          let colIndex = x1
          while ( colIndex > x2 ) {
            row.children[colIndex].className = ''
            colIndex = colIndex - 1
          }
        }
      } else {
        if ( index >= selection.current.y2 && index <= selection.current.y1 ) {
          // reset cell class names on the vertical axes
          let colIndex = x1
          while ( colIndex > x2 ) {
            row.children[colIndex].className = ''
            colIndex = colIndex - 1
          }
        }
      }
    })

    // reset cell class names on the horizontal axes
    let rowIndex = y1
    while ( rowIndex > y2 ) {
      const row = rows[rowIndex]
      if ( selection.current.x1 < selection.current.x2 ) {
        let colIndex = selection.current.x1
        while ( colIndex <= selection.current.x2 ) {
          row.children[colIndex].className = ''
          colIndex = colIndex + 1
        }
      } else {
        let colIndex = selection.current.x2
        while ( colIndex <= selection.current.x1 ) {
          row.children[colIndex].className = ''
          colIndex = colIndex + 1
        }
      }
      rowIndex = rowIndex - 1
    }
  }

  useEffect(() => {
    updateSelections()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnnotationBlock, selection.current])

  const updateSelections = () => {
    if ( !selection.current ) { return }

    // Reset selections before update
    resetSelection()
    tableElement.current.classList.add('active')

    const classNames = ['active']
    if ( selectedAnnotationBlock ) {
      const { role } = selectedAnnotationBlock
      if ( role ) {
        classNames.push(`role-${role}`)
      }
    }

    const rows = tableElement.current.querySelectorAll('tr')
    const { x1, x2, y1, y2 } = selection.current
    const leftCol = Math.min(x1, x2)
    const rightCol = Math.max(x1, x2)
    const topRow = Math.min(y1, y2)
    const bottomRow = Math.max(y1, y2)
    let rowIndex = topRow
    while ( rowIndex <= bottomRow ) {
      let colIndex = leftCol
      while ( colIndex <= rightCol ) {
        selectCell(
          rows[rowIndex].children[colIndex],
          rowIndex,
          colIndex,
          topRow,
          leftCol,
          rightCol,
          bottomRow,
          classNames,
        )
        colIndex += 1
      }
      rowIndex += 1
    }
  }

  const selectCell = (cell, rowIndex, colIndex, topRow, leftCol, rightCol, bottomRow, classNames = []) => {
    // Apply class names to the selected cell
    classNames.map(className => cell.classList.add(className))

    // Add a top border to the cells at the top of the selection
    if ( rowIndex === topRow ) {
      const borderTop = document.createElement('div')
      borderTop.classList.add('cell-border-top')
      cell.appendChild(borderTop)
    }

    // Add a left border to the cells on the left of the selection
    if ( colIndex === leftCol ) {
      const borderLeft = document.createElement('div')
      borderLeft.classList.add('cell-border-left')
      cell.appendChild(borderLeft)
    }

    // Add a right border to the cells on the right of the selection
    if ( colIndex === rightCol ) {
      const borderRight = document.createElement('div')
      borderRight.classList.add('cell-border-right')
      cell.appendChild(borderRight)
    }

    // Add a bottom border to the cells at the bottom of the selection
    if ( rowIndex === bottomRow ) {
      const borderBottom = document.createElement('div')
      borderBottom.classList.add('cell-border-bottom')
      cell.appendChild(borderBottom)
    }

    // Add resize corner to the active selection areas
    if ( classNames.includes('active') ) {
      if (rowIndex === bottomRow && colIndex === rightCol) {
        const resizeCorner = document.createElement('div')
        resizeCorner.classList.add('cell-resize-corner')
        cell.appendChild(resizeCorner)
      }
    }
  }

  const handleOnMouseUp = () => {
    if ( selection.current ) {
      selection.current = utils.standardizeSelection(selection.current)
      if ( !selectedAnnotationBlock && utils.checkOverlaps(selection.current, []) ) {
        hideAnnotationMenu()
      } else {
        setShowAnnotationMenu(true)
      }
    }
    setUserSelecting(false)
    setShowAnnotationMenu(true)
  }

  const handleOnMouseDown = event => {
    const element = event.target

    // Allow users to select the resize-corner of the cell
    if ( element.className === 'cell-resize-corner' ) {
      prevElement.current = element.parentElement
      setUserSelecting(true)
      return
    } else if ( element.nodeName !== 'TD' ) { return }

    // Set both coordinates to the same cell
    const x1 = element.cellIndex
    const x2 = element.cellIndex
    const y1 = element.parentElement.rowIndex
    const y2 = element.parentElement.rowIndex
    const newSelection = { x1, x2, y1, y2 }

    // check if the user is selecting an annotation block
    const selectedBlock = utils.checkSelectedAnnotationBlocks(newSelection, [])
    if ( selectedBlock ) {

      // Reset annotation menu
      if ( selectedBlock !== selectedAnnotationBlock ) {
        hideAnnotationMenu()

        selection.current = selectedBlock.selection
        setSelectedAnnotationBlock(selectedBlock)
      }

      return
    }

    // Activate the selection mode
    setUserSelecting(true)

    // Extend the previous selection if user is holding down Shift key
    if ( event.shiftKey && selection.current ) {

      // initialize the updated selection object
      const newUserSelection = {}

      // Extend the previous selection left or right
      if ( x1 !== selection.current['x1'] ) {
        if ( x1 < selection.current['x1'] ) {
          newUserSelection['x1'] = x1
        } else {
          newUserSelection['x2'] = x1
        }
      }

      // Extend the previous selection up or down
      if ( y1 !== selection.current['y1'] ) {
        if ( y1 < selection.current['y1'] ) {
          newUserSelection['y1'] = y1
        } else {
          newUserSelection['y2'] = y1
        }
      }

      // Update user selection with the new coordinates
      selection.current = {...selection.current, ...newUserSelection}
    } else {

      // Reset annotation menu
      hideAnnotationMenu()

      // Activate the element on click
      selectCell(element, y1, x1, y1, x1, x1, y1, ['active'])
      selection.current = { x1, x2, y1, y2 }
    }

    // Initialize the previous element with the one selected
    prevElement.current = element
  }

  const handleOnMouseMove = event => {
    const element = event.target
    if ( element === prevElement.current ) { return }

    // Don't allow out-of-bounds resizing
    if ( element.nodeName !== 'TD' ) { return }

    if ( userSelecting && !event.shiftKey ) {
      if ( !selection.current ) { return }

      // Update the last x and y coordinates of the selection
      const newCellIndex = element.cellIndex
      const newRowIndex = element.parentElement.rowIndex
      selection.current = {...selection.current, x2: newCellIndex, y2: newRowIndex}

      if ( prevElement.current.nodeName === 'TD' ) {
        if ( selectedAnnotationBlock ) {
          const oldCellIndex = prevElement.current.cellIndex
          const oldRowIndex = prevElement.current.parentElement.rowIndex
          if ( newCellIndex <= oldCellIndex || newRowIndex <= oldRowIndex ) {
            resetEmptyCells(oldCellIndex, newCellIndex, oldRowIndex, newRowIndex)
          }
        }
      }

      // Update reference to the previous element
      prevElement.current = element

      // Update selections
      updateSelections()
    }
  }

  const hideAnnotationMenu = () => {
    setShowAnnotationMenu(false)
    setSelectedAnnotationBlock(undefined)
    selection.current = null
    resetSelection()
    //this.updateAnnotationBlocks()
  }

  const renderTable = () => {
    return (
      <Paper>
        <div className={classes.tableWrapper}>
          <table ref={element => tableElement.current = element}
            onMouseDown={event => handleOnMouseDown(event)}
            onMouseMove={event => handleOnMouseMove(event)}>
            <thead>
              <tr>
                <th></th>
                {cols.map((r, i) => (
                  <th key={i}>
                    <div onDoubleClick={event => handleOnClickHeader(event)}>
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

  const handleOnSelectionChange = newSelection => {
    selection.current = {...newSelection}
    updateSelections()
  }

  const renderAnnotationMenu = () => {
    if ( !selection.current ) { return }
    return (
      <AnnotationMenu
        selection={selection.current}
        onSelectionChange={handleOnSelectionChange}
        openMenu={showAnnotationMenu}
        hideMenu={hideAnnotationMenu} />
    )
  }

  return (
    <React.Fragment>
      {renderTable()}
      {renderAnnotationMenu()}
    </React.Fragment>
  )
}


export default Table
