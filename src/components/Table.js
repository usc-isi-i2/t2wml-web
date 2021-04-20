import React, { useEffect, useRef, useState } from 'react'

import { Paper } from '@material-ui/core'

import AnnotationMenu from './AnnotationMenu'

import useStyles from '../styles/table'
import * as utils from '../utils/table'


const Table = ({ file, sheet, data, updateOutputData }) => {

  const classes = useStyles()

  const selection = useRef(null)
  const timeoutID = useRef(null)
  const prevElement = useRef(null)
  const tableElement = useRef(null)
  const prevDirection = useRef(null)

  const [userSelecting, setUserSelecting] = useState(false)
  const [annotationBlocks, setAnnotationBlocks] = useState([])
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
    document.addEventListener('keyup', handleOnKeyUp)
    document.addEventListener('mouseup', handleOnMouseUp)

    // component will unmount
    return () => {
      document.removeEventListener('keydown', handleOnKeyDown)
      document.removeEventListener('keyup', handleOnKeyUp)
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

      // Hide annotation menu when moving
      setShowAnnotationMenu(false)

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

      // check if the user is selecting an annotation block
      setAnnotationBlocks(annotationBlocks => {
        const selectedBlock = utils.checkSelectedAnnotationBlocks(selection.current, annotationBlocks)
        if ( selectedBlock ) {
          // Reset annotation menu
          if ( selectedBlock !== selectedAnnotationBlock ) {
            setSelectedAnnotationBlock(selectedBlock)
            selection.current = selectedBlock.selection
          }
        } else {
          setSelectedAnnotationBlock(undefined)
          updateSelections()
        }
        return annotationBlocks
      })
    }
  }

  const handleOnKeyUp = () => {
    clearTimeout(timeoutID.current)
    timeoutID.current = setTimeout(() => {
      setShowAnnotationMenu(true)
    }, 350)
  }

  const resetSelection = () => {
    tableElement.current.classList.remove('active')
    tableElement.current.querySelectorAll('.active .cell-border-top').forEach(e => e.remove())
    tableElement.current.querySelectorAll('.active .cell-border-left').forEach(e => e.remove())
    tableElement.current.querySelectorAll('.active .cell-border-right').forEach(e => e.remove())
    tableElement.current.querySelectorAll('.active .cell-border-bottom').forEach(e => e.remove())
    tableElement.current.querySelectorAll('.active .cell-resize-corner').forEach(e => e.remove())
    tableElement.current.querySelectorAll('td[class*="active"]').forEach(e => {
      e.classList.forEach(className => {
        if (className.startsWith('active')) {
          e.classList.remove(className)
        }
      })
    })
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
        const cell = rows[rowIndex].children[colIndex]
        if ( !!cell ) {
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
        }
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
      if ( !selectedAnnotationBlock && utils.checkOverlaps(
        selection.current,
        annotationBlocks.map(block => block.selection),
      ) ) {
        hideAnnotationMenu()
      } else {
        setShowAnnotationMenu(true)
      }
    }
    setUserSelecting(false)
  }

  const handleOnMouseDown = event => {
    const element = event.target

    // Allow users to select the resize-corner of the cell
    if ( element.className === 'cell-resize-corner' ) {
      prevElement.current = element.parentElement
      setShowAnnotationMenu(false)
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
    const selectedBlock = utils.checkSelectedAnnotationBlocks(newSelection, annotationBlocks)
    if ( selectedBlock ) {

      // Reset annotation menu
      if ( selectedBlock !== selectedAnnotationBlock ) {
        setSelectedAnnotationBlock(selectedBlock)
        selection.current = selectedBlock.selection
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
      selection.current = {
        ...selection.current,
        x2: newCellIndex,
        y2: newRowIndex,
      }

      // Update Selections
      updateSelections()

      // Update selected annotation block area when resizing
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
    }
  }

  useEffect(() => {
    updateAnnotationBlocks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annotationBlocks])

  const removeAnnotationBlock = (annotationBlock) => {
    const rows = tableElement.current.querySelectorAll('tr')
    const { x1, x2, y1, y2 } = annotationBlock.selection
    const leftCol = Math.min(x1, x2)
    const rightCol = Math.max(x1, x2)
    const topRow = Math.min(y1, y2)
    const bottomRow = Math.max(y1, y2)
    let rowIndex = topRow
    while ( rowIndex <= bottomRow ) {
      let colIndex = leftCol
      while ( colIndex <= rightCol ) {
        const element = rows[rowIndex].children[colIndex]
        element.classList.forEach(className => {
          if ( className.startsWith('role-') || className.startsWith('type-') ) {
            element.classList.remove(className)
          }
        })
        colIndex += 1
      }
      rowIndex += 1
    }
  }

  const updateAnnotationBlocks = () => {
    for ( const block of annotationBlocks ) {
      const { role, type, selection } = block

      const classNames = []
      if ( role ) {
        classNames.push(`role-${role}`)
      }
      if ( type ) {
        classNames.push(`type-${type}`)
      }

      const rows = tableElement.current.querySelectorAll('tr')
      const { x1, y1, x2, y2 } = selection
      const leftCol = Math.min(x1, x2)
      const rightCol = Math.max(x1, x2)
      const topRow = Math.min(y1, y2)
      const bottomRow = Math.max(y1, y2)
      let rowIndex = topRow
      while ( rowIndex <= bottomRow ) {
        let colIndex = leftCol
        const row = rows[rowIndex]
        while ( row && colIndex <= rightCol ) {
          selectCell(
            row.children[colIndex],
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
  }

  const hideAnnotationMenu = (annotations, deletedAnnotationBlock=null) => {

    setShowAnnotationMenu(false)
    setSelectedAnnotationBlock(undefined)
    selection.current = null
    resetSelection()

    if ( annotations && annotations instanceof Array ) {
      setAnnotationBlocks(annotationBlocks => {
        if ( deletedAnnotationBlock ) {
          removeAnnotationBlock(deletedAnnotationBlock)
        }

        // fetch updated output
        updateOutputData()

        return annotations
      })
    }
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
                <th scope="col"></th>
                {cols.map((r, i) => (
                  <th scope="col" key={i}>
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

    // trigger a re-render of the annotation menu with the updated selection
    setAnnotationBlocks(annotationBlocks => ([...annotationBlocks]))
  }

  const renderAnnotationMenu = () => {
    if ( !selection.current ) { return }
    return (
      <AnnotationMenu
        file={file}
        sheet={sheet}
        selection={selection.current}
        annotations={annotationBlocks}
        selectedAnnotation={selectedAnnotationBlock}
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
