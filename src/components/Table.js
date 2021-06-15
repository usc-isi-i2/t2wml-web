import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Paper } from '@material-ui/core'

import OverlayMenu from './OverlayMenu'
import useStyles from '../styles/table'
import * as utils from '../utils/table'
import fetchPartialCSV from '../utils/fetchPartialCSV'
import fetchSuggestions from '../utils/fetchSuggestions'
import uploadAnnotations from '../utils/uploadAnnotations'


const Table = ({
  file,
  sheet,
  data,
  setMessage,
  suggestedAnnotations,
  setOutputData,
}) => {

  const classes = useStyles()

  const selection = useRef(null)
  const timeoutID = useRef(null)
  const prevElement = useRef(null)
  const tableElement = useRef(null)
  const prevDirection = useRef(null)

  const [userSelecting, setUserSelecting] = useState(false)
  const [annotationBlocks, setAnnotationBlocks] = useState([])
  const [selectedAnnotationBlock, setSelectedAnnotationBlock] = useState()
  const [suggestedAnnotation, setSuggestedAnnotation] = useState()

  const [selectedTab, setSelectedTab] = useState('block')
  const [showOverlayMenu, setShowOverlayMenu] = useState(false)
  const [targetSelection, setTargetSelection] = useState(false)

  const MIN_NUM_ROWS = 100
  const rows = [...Array(Math.max(data.length, MIN_NUM_ROWS))]
  const cols = [...Array(Math.max(data[0].length, 26))]

  const handleOnClickHeader = event => {
    const element = event.target
    const index = element.parentElement.cellIndex

    const rows = tableElement.current.querySelectorAll('tr')

    let maxWidth = 0
    rows.forEach(row => {
      if ( row.children[index].scrollWidth > maxWidth ) {
        maxWidth = row.children[index].scrollWidth
      }
    })

    element.setAttribute('style', `width: ${maxWidth}px`)
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

  useEffect(() => {

    // user is opening the annotation menu with a selection
    if ( selection.current && showOverlayMenu && !selectedAnnotationBlock ) {

      // check that the selected cells have content
      if ( utils.selectionHasData(data, selection) ) {

        // call the annotation suggestion endpoint
        fetchSuggestions(file, sheet, selection.current, annotationBlocks)
        .then(data => {
          setSuggestedAnnotation(data)

          // upload suggestions as a new annotation
          const annotations = annotationBlocks
          const newAnnotation = {
            selection: {...selection.current},
            ...data,
          }
          if ( !!data.children.property ) {
            newAnnotation.property = data.children.property
          }
          annotations.push(newAnnotation)
          uploadAnnotations(file, sheet, annotations, () => {}).then(data => {
            setAnnotationBlocks(data.annotations)
            if ( selection.current ) {
              const selectedBlock = utils.checkSelectedAnnotationBlocks(selection.current, data.annotations)
              setSelectedAnnotationBlock(selectedBlock)
            }
            updatePartialCSV()
          })
          .catch(error => {
            setMessage({
              type: 'error',
              title: `${error.errorCode} - ${error.errorTitle}`,
              text: error.errorDescription,
            })
          })
        })
        .catch(error => {
          setMessage({
            type: 'error',
            title: `${error.errorCode} - ${error.errorTitle}`,
            text: error.errorDescription,
          })
        })
      }
    } else {

      // reset the suggestions otherwise
      setSuggestedAnnotation()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOverlayMenu])

  const handleOnKeyDown = event => {

    // Close annotation menu with ESC key
    if ( event.code === 'Escape' ) {
      hideOverlayMenu()
    }

    const arrowKeyCodes = [
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
    ]
    if ( arrowKeyCodes.includes(event.code) && selection.current ) {

      // Don't allow moving around when users are typing
      if ( event.target.nodeName === 'INPUT' ) { return }

      // Don't allow moving around when users are selecting in menus
      if ( event.target.nodeName === 'LI' ) { return }

      // Prevent scroll with arrow keys
      event.preventDefault()

      // Hide annotation menu when moving
      setShowOverlayMenu(false)

      setTargetSelection(targetSelection => {

        let nextSelection = targetSelection
        const { x1, x2, y1, y2 } = targetSelection
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
            nextSelection = {'x1': x1, 'x2': x1, 'y1': y1 - 1, 'y2': y1 - 1}
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
            nextSelection = {'x1': x1, 'x2': x1, 'y1': y1 + 1, 'y2': y1 + 1}
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
            nextSelection = {'x1': x1 - 1, 'x2': x1 - 1, 'y1': y1, 'y2': y1}
            const nextElement = rows[y1].children[x1 - 1]
            prevElement.current = nextElement
          }
        }

        // arrow right
        if ( event.code === 'ArrowRight' && x1 < rows[y1].children.length - 1 ) {
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
            nextSelection = {'x1': x1 + 1, 'x2': x1 + 1, 'y1': y1, 'y2': y1}
            const nextElement = rows[y1].children[x1 + 1]
            prevElement.current = nextElement
          }
        }

        // check if the user is selecting an annotation block
        setAnnotationBlocks(annotationBlocks => {
          const selectedBlock = utils.checkSelectedAnnotationBlocks(nextSelection, annotationBlocks)
          if ( selectedBlock ) {
            // Reset annotation menu
            if ( selectedBlock !== selectedAnnotationBlock ) {
              setSelectedAnnotationBlock(selectedBlock)
              selection.current = selectedBlock.selection
            }
          } else {
            setSelectedAnnotationBlock(undefined)
            selection.current = nextSelection
          }
          updateSelections()
          return annotationBlocks
        })

        return nextSelection
      })
    }
  }

  const handleOnKeyUp = () => {
    clearTimeout(timeoutID.current)
    timeoutID.current = setTimeout(() => {
      setShowOverlayMenu(true)
    }, 350)
  }

  const resetSelection = () => {
    if ( !tableElement.current ) { return }
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

    // reset the borders on the annotation blocks
    updateAnnotationBlocks()
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
    // remove any previous highlights from the table cells
    tableElement.current.querySelectorAll('td.highlight').forEach(e => {
      e.classList.remove('highlight')
    })

    // highlight original target selection (cell)
    if ( !targetSelection || !tableElement.current ) { return }
    const {x1, y1} = targetSelection
    const rows = tableElement.current.querySelectorAll('tr')
    const element = rows[y1].children[x1]
    element.classList.add('highlight')
  }, [targetSelection])

  useEffect(() => {
    updateSelections()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnnotationBlock, selection.current])

  useEffect(() => {
    // show the annotation blocks for the suggested/guessed annotations
    setAnnotationBlocks(suggestedAnnotations)

    // update output data with partial csv
    if ( !!suggestedAnnotations.length ) {
      fetchPartialCSV(file, sheet)
      .then(data => setOutputData(data.cells))
      .catch(error => {
        setMessage({
          type: 'error',
          title: `${error.errorCode} - ${error.errorTitle}`,
          text: error.errorDescription,
        })
      })
    }
  }, [suggestedAnnotations, file, sheet, setOutputData, setMessage])

  useEffect(() => {
    setSelectedAnnotationBlock(selectedAnnotation => {
      if ( !selectedAnnotation ) { return undefined}
      const filteredAnnotation = annotationBlocks.find(
        annotation => annotation.id === selectedAnnotation.id
      )
      if ( !filteredAnnotation ) {
        return selectedAnnotation
      }
      return filteredAnnotation
    })

  }, [annotationBlocks])

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
        if ( !rows[rowIndex] ) { break }
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

    // remove any remaining role or type classes from the cell/element
    cell.classList.forEach(className => {
      if ( className.startsWith('role-') || className.startsWith('type-') ) {
        cell.classList.remove(className)
      }
    })

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
      setAnnotationBlocks(annotationBlocks => {
        setSelectedAnnotationBlock(selectedAnnotationBlock => {
          if ( !selectedAnnotationBlock && utils.checkOverlaps(
            selection.current,
            annotationBlocks.map(block => block.selection),
          ) ) {
            setShowOverlayMenu(false)
            setSelectedAnnotationBlock(undefined)
            setTargetSelection(undefined)
            selection.current = null
            resetSelection()
          } else {
            setShowOverlayMenu(true)
          }
          return selectedAnnotationBlock
        })
        return annotationBlocks
      })
    }
    setUserSelecting(false)
  }

  const handleOnMouseDown = event => {
    const element = event.target

    // Allow users to select the resize-corner of the cell
    if ( element.className === 'cell-resize-corner' ) {
      prevElement.current = element.parentElement
      setShowOverlayMenu(false)
      setUserSelecting(true)
      return
    } else if ( element.nodeName !== 'TD' ) { return }

    // Set both coordinates to the same cell
    const x1 = element.cellIndex
    const x2 = element.cellIndex
    const y1 = element.parentElement.rowIndex
    const y2 = element.parentElement.rowIndex
    const newSelection = { x1, x2, y1, y2 }
    setTargetSelection(newSelection)

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
      setShowOverlayMenu(false)
      setSelectedAnnotationBlock(undefined)

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

  const updateAnnotationBlocks = useCallback(() => {
    setAnnotationBlocks(annotationBlocks => {
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
            const cell = row.children[colIndex]
            if ( !!cell ) {

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
            }
            colIndex += 1
          }
          rowIndex += 1
        }
      }
      return annotationBlocks
    })
  }, [])

  useEffect(() => {
    updateAnnotationBlocks()
  }, [annotationBlocks, updateAnnotationBlocks])

  const updatePartialCSV = () => {
    // update output data with partial csv
    fetchPartialCSV(file, sheet)
    .then(data => setOutputData(data.cells))
    .catch(error => {
      setMessage({
        type: 'error',
        title: `${error.errorCode} - ${error.errorTitle}`,
        text: error.errorDescription,
      })
    })
  }

  const updateAnnotation = (annotations, deletedAnnotationBlock=null) => {
    if ( annotations && annotations instanceof Array ) {
      setAnnotationBlocks(annotationBlocks => {
        if ( deletedAnnotationBlock ) {
          removeAnnotationBlock(deletedAnnotationBlock)
        }
        return annotations
      })
      updatePartialCSV()
    }
  }

  const hideOverlayMenu = () => {
    setShowOverlayMenu(false)
    setSelectedAnnotationBlock(undefined)
    setTargetSelection(undefined)
    selection.current = null
    resetSelection()
  }

  const renderTable = () => {
    return (
      <Paper>
        <div className={classes.tableWrapper}>
          <table ref={element => tableElement.current = element}
            onMouseDown={handleOnMouseDown}
            onMouseMove={handleOnMouseMove}>
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

  const renderOverlayMenu = () => {
    if ( !targetSelection || !selection.current || !showOverlayMenu ) { return }
    let selectedCellValue = ''
    if ( !!data[targetSelection.y1-1] ) {
      selectedCellValue = data[targetSelection.y1-1][targetSelection.x1-1]
    }
    return (
      <OverlayMenu
        file={file}
        sheet={sheet}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        selectedCell={{...targetSelection, value: selectedCellValue}}
        selection={selection.current}
        annotations={annotationBlocks}
        suggestedAnnotation={suggestedAnnotation}
        selectedAnnotation={selectedAnnotationBlock}
        onSelectionChange={handleOnSelectionChange}
        updateAnnotation={updateAnnotation}
        hideOverlayMenu={hideOverlayMenu}
        setMessage={setMessage} />
    )
  }

  return (
    <React.Fragment>
      {renderTable()}
      {renderOverlayMenu()}
    </React.Fragment>
  )
}


export default Table
