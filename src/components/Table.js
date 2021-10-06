import React, { useCallback, useEffect, useRef, useState } from 'react'

import {
  Column,
  AutoSizer,
  Table as VirtualizedTable,
} from 'react-virtualized'

import { Paper } from '@material-ui/core'

import TableCell from './TableCell'
import OverlayMenu from './OverlayMenu'
import useStyles from '../styles/table'
import * as utils from '../utils/table'
import fetchSuggestions from '../utils/fetchSuggestions'
import uploadAnnotations from '../utils/uploadAnnotations'
import uploadWikinodes from '../utils/uploadWikinodes'
import wikifyRegion from '../utils/wikifyRegion'
import deleteWikifiedRegion from '../utils/deleteWikifiedRegion'
import fetchTableRows from '../utils/fetchTableRows'


const DEFAULT_CELL_STATE = {
  active: false,
  activeTop: false,
  activeLeft: false,
  activeRight: false,
  activeBottom: false,
  activeCorner: false,
  highlight: false,
}


const Table = ({
  projectData,
  setMessage,
  suggestedAnnotations,
  updateOutputPreview,
}) => {

  const classes = useStyles()

  const rows = useRef(null)
  const cols = useRef(null)

  const selection = useRef(null)
  const timeoutID = useRef(null)
  const prevElement = useRef(null)
  const prevDirection = useRef(null)

  const [layers, setLayers] = useState({})

  const [startIndex, setStartIndex] = useState(0)
  const [stopIndex, setStopIndex] = useState(99)
  const [scrollToIndex, setScrollToIndex] = useState()

  const [tableData, setTableData] = useState(null)
  const [loadingMoreRows, setLoadingMoreRows] = useState(false)
  const [tableDataInitialized, setTableDataInitialized] = useState(false)

  const [userSelecting, setUserSelecting] = useState(false)
  const [annotationBlocks, setAnnotationBlocks] = useState([])
  const [selectedAnnotationBlock, setSelectedAnnotationBlock] = useState()
  const [suggestedAnnotation, setSuggestedAnnotation] = useState()

  const [selectedTab, setSelectedTab] = useState('block') // or 'cell'
  const [showOverlayMenu, setShowOverlayMenu] = useState(false)
  const [targetSelection, setTargetSelection] = useState(false)

  const handleOnClickHeader = event => {
    const element = event.target
    const colIndex = parseInt(element.dataset.colIndex)

    setTableData(prevTableData => {
      const tableData = {...prevTableData}

      Object.entries(tableData).forEach(data => {
        const rowIndex = data[0]
        tableData[rowIndex][colIndex - 1] = {
          ...tableData[rowIndex][colIndex - 1],
          maxWidth: true,
        }
      })

      return tableData
    })
  }

  const updateAnnotationBlocks = useCallback(() => {
    setTableData(prevTableData => {
      const tableData = {...prevTableData}

      setAnnotationBlocks(annotationBlocks => {
        for ( const block of annotationBlocks ) {
          const { role, type } = block

          const classNames = []
          if ( role ) {
            classNames.push(`role-${role}`)
          }
          if ( type ) {
            classNames.push(`type-${type}`)
          }

          const { x1, y1, x2, y2 } = block.selection
          const leftCol = Math.min(x1 - 1, x2 - 1)
          const rightCol = Math.max(x1 - 1, x2 - 1)
          const topRow = Math.min(y1 - 1, y2 - 1)
          const bottomRow = Math.max(y1 - 1, y2 - 1)
          let rowIndex = topRow
          while ( rowIndex <= bottomRow && rowIndex >= 0 && rowIndex < rows.current.length ) {
            let colIndex = leftCol
            while ( colIndex <= rightCol && colIndex >= 0 && colIndex < cols.current.length ) {

              const cellData = tableData[rowIndex][colIndex]
              cellData.classNames = classNames
              cellData.annotation = true
              cellData.highlight = false
              cellData.activeTop = false
              cellData.activeLeft = false
              cellData.activeRight = false
              cellData.activeBottom = false
              cellData.activeCorner = false

              if ( !!selection.current &&
                block.selection.x1 === selection.current.x1 &&
                block.selection.x2 === selection.current.x2 &&
                block.selection.y1 === selection.current.y1 &&
                block.selection.y2 === selection.current.y2 ) {
                cellData.active = true
              } else {
                cellData.active = false
              }

              // Add a top border to the cells at the top of the selection
              if ( rowIndex === topRow ) {
                cellData.activeTop = true
              }

              // Add a left border to the cells on the left of the selection
              if ( colIndex === leftCol ) {
                cellData.activeLeft = true
              }

              // Add a right border to the cells on the right of the selection
              if ( colIndex === rightCol ) {
                cellData.activeRight = true
              }

              // Add a bottom border to the cells at the bottom of the selection
              if ( rowIndex === bottomRow ) {
                cellData.activeBottom = true
              }

              // Add resize corner to the active selection areas
              if (rowIndex === bottomRow && colIndex === rightCol) {
                cellData.activeCorner = true
              }
              tableData[rowIndex][colIndex] = {...cellData}

              colIndex += 1
            }
            rowIndex += 1
          }
        }
        return annotationBlocks
      })

      setTargetSelection(targetSelection => {
        // highlight the target selection when updating
        if ( !!targetSelection ) {
          tableData[targetSelection.y1 - 1][targetSelection.x1 - 1] = {
            ...tableData[targetSelection.y1 - 1][targetSelection.x1 - 1],
            highlight: true,
          }
        }
        return targetSelection
      })

      return tableData
    })
  }, [])


  const rowGetter = index => {
    const rowData = Object.entries(tableData[index])
    if ( !rowData[0][1].loaded ) {
      loadTableData(index - 50, index + 50)
    }

    return rowData
  }

  const loadTableData = useCallback((startIndex, stopIndex) => {
    if ( loadingMoreRows ) { return }
    setLoadingMoreRows(true)

    return new Promise((resolve, reject) => {
      fetchTableRows(
        projectData.filepath,
        projectData.sheetName,
        startIndex,
        stopIndex,
      )
      .then(data => {

        const newData = data.table.cells

        rows.current = [...Array(stopIndex)] // extend to include new rows

        setTableData(prevTableData => {
          const tableData = {...prevTableData}

          Object.entries(newData).forEach((rowItem, rowIndex) => {
            tableData[startIndex + rowIndex] = {}
            Object.entries(cols.current).forEach((colItem, colIndex) => {
              if ( !!newData[rowIndex] ) {
                const cellValue = newData[rowIndex][colIndex]
                if ( !!cellValue ) {
                  tableData[startIndex + rowIndex][colIndex] = {
                    value: cellValue,
                    loaded: true,
                    classNames: [],
                  }
                } else {
                  tableData[startIndex + rowIndex][colIndex] = {
                    value: '',
                    loaded: true,
                    classNames: [],
                  }
                }
              } else {
                tableData[startIndex + rowIndex][colIndex] = {
                  value: '',
                  loaded: false,
                  classNames: [],
                }
              }
            })
          })

          return tableData
        })

        // update annotations
        updateAnnotationBlocks()

        // update the layers
        setLayers(data.layers)

        // update start and stop indices
        setStartIndex(startIndex)
        setStopIndex(stopIndex)

        setLoadingMoreRows(false)
        resolve()
      })
      .catch(error => {
        reject(error)
      })
    })
  }, [
    loadingMoreRows,
    projectData.filepath,
    projectData.sheetName,
    updateAnnotationBlocks,
  ])

  useEffect(() => {
    // update project annotations
    const annotations = projectData.annotations
    if ( !!annotations ) {
      setAnnotationBlocks(annotations)
    }

    // update project layers
    const layers = projectData.layers
    if ( !!layers && 'qnode' in layers && 'entries' in layers.qnode ) {
      setLayers(layers)
    }

    // Don't bother if the table data was already initialized
    if ( tableDataInitialized ) { return }

    setTableData(prev => {
      const tableData = {} // empty table data
      const data = projectData.table.cells
      const dims = projectData.table.dims

      rows.current = [...Array(Math.max(dims[0], 100))] // at least 100 rows
      cols.current = [...Array(Math.max(dims[1], 26))]  // at least 26 cols

      Object.entries(rows.current).forEach((rowItem, rowIndex) => {
        tableData[rowIndex] = {}
        Object.entries(cols.current).forEach((colItem, colIndex) => {
          if ( !!data[rowIndex] ) {
            const cellValue = data[rowIndex][colIndex]
            if ( !!cellValue ) {
              tableData[rowIndex][colIndex] = {
                value: cellValue,
                loaded: true,
                classNames: [],
              }
            } else {
              tableData[rowIndex][colIndex] = {
                value: '',
                loaded: true,
                classNames: [],
              }
            }
          } else {
            tableData[rowIndex][colIndex] = {
              value: '',
              loaded: false,
              classNames: [],
            }
          }
        })
      })
      setTableDataInitialized(true)
      return tableData
    })

  }, [projectData, tableDataInitialized])

  useEffect(() => {
    if ( 'qnode' in layers && 'entries' in layers.qnode ) {
      updateTableDataLayers(layers)
    }
  }, [layers])

  const updateTableDataLayers = layers => {
    setTableData(prevTableData => {
      const tableData = {...prevTableData}
      layers.qnode.entries.forEach(qnode => {
        qnode.indices.forEach(([rowIndex, colIndex]) => {
          if ( !tableData[rowIndex] || !tableData[rowIndex][colIndex] ) {
            return
          }
          tableData[rowIndex][colIndex] = {
            ...tableData[rowIndex][colIndex],
            qnode: {
              id: qnode.id,
              label: qnode.label,
              value: qnode.value,
              description: qnode.description,
              data_type: qnode.data_type,
              tags: qnode.tags,
              url: qnode.url,
            },
          }
        })
      })
      return tableData
    })
  }

  const updateQnodeLayer = entity => {
    const entries = layers.qnode.entries.map(qnode => {
      if ( qnode.id === entity.id ) {
        return {...qnode, ...entity}
      }
      return qnode
    })
    setLayers({qnode: {entries}})
    updateOutputPreview()
  }

  useEffect(() => {

    // user is opening the annotation menu with a selection
    if ( selection.current && showOverlayMenu && !selectedAnnotationBlock ) {

      // check that the selected cells have content
      if ( utils.selectionHasData(projectData.table.cells, selection) ) {

        // call the annotation suggestion endpoint
        fetchSuggestions(projectData.filepath, projectData.sheetName, selection.current, annotationBlocks)
        .then(data => {
          setSuggestedAnnotation(data)
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

  const submitNewAnnotation = formState => {

    if ( !utils.selectionHasData(projectData.table.cells, selection) ) {
      setMessage({
        type: 'error',
        title: 'Selection is missing table data',
        text: 'Annotations can only be created if there is table data',
      })
      return
    }

    // upload suggestions as a new annotation
    const annotations = annotationBlocks
    const newAnnotation = {
      selection: {...selection.current},
      ...suggestedAnnotation,
      ...formState,
    }
    if ( !!suggestedAnnotation.children.property ) {
      newAnnotation.property = suggestedAnnotation.children.property
    }
    annotations.push(newAnnotation)
    uploadAnnotations(projectData.filepath, projectData.sheetName, annotations, () => {}).then(data => {
      setAnnotationBlocks(data.annotations)
      if ( selection.current ) {
        const selectedBlock = utils.checkSelectedAnnotationBlocks(selection.current, data.annotations)
        setSelectedAnnotationBlock(selectedBlock)
      }
      if ( utils.isWikifyable({role: newAnnotation.role}) ) {
        if ( newAnnotation.role === 'mainSubject' ) {
          wikifyRegion(
            projectData.filepath,
            projectData.sheetName,
            newAnnotation.selection,
            startIndex,
            stopIndex,
          )
          .then(layers => {
            setLayers(layers)

            // Show a success message
            setMessage({
              type: 'success',
              text: 'Countries wikifed automatically!',
            })
          })
          .catch(error => {
            setMessage({
              type: 'error',
              title: `${error.errorCode} - ${error.errorTitle}`,
              text: error.errorDescription,
            })
          })
        } else {
          uploadWikinodes(
            projectData.filepath,
            projectData.sheetName,
            newAnnotation.selection,
            newAnnotation.role === 'property' || newAnnotation.type === 'property',
            'string',
          )
          .then(layers => {
            setLayers(layers)

            // Show a success message
            setMessage({
              type: 'success',
              text: 'Property wikifed automatically!',
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
      }
      updateOutputPreview()
    })
    .catch(error => {
      setMessage({
        type: 'error',
        title: `${error.errorCode} - ${error.errorTitle}`,
        text: error.errorDescription,
      })
    })

    // Close the annotation/wikification menu
    hideOverlayMenu()
  }

  const resetSelections = useCallback(() => {
    setTableData(prevTableData => {
      const tableData = {...prevTableData}
      for ( const rowIndex of Object.keys(tableData) ) {
        for ( const colIndex of Object.keys(tableData[rowIndex]) ) {
          if ( tableData[rowIndex][colIndex]['active'] ) {
            if ( tableData[rowIndex][colIndex]['annotation'] ) {
              tableData[rowIndex][colIndex] = {
                ...tableData[rowIndex][colIndex],
                highlight: false,
                active: false,
              }
            } else {
              tableData[rowIndex][colIndex] = {
                ...tableData[rowIndex][colIndex],
                ...DEFAULT_CELL_STATE,
              }
            }
          }
        }
      }
      return tableData
    })
  }, [])

  const hideOverlayMenu = useCallback(() => {
    setShowOverlayMenu(false)
    setSelectedAnnotationBlock(undefined)
    setTargetSelection(undefined)
    selection.current = null
    resetSelections()
  }, [resetSelections])

  const updateSelections = useCallback(prevSelection => {
    if ( !selection.current ) { return }

    setTableData(prevTableData => {
      const tableData = {...prevTableData}

      const classNames = []
      setSelectedAnnotationBlock(selectedAnnotationBlock => {
        if ( selectedAnnotationBlock ) {
          const { role } = selectedAnnotationBlock
          if ( role ) {
            classNames.push(`role-${role}`)
          }
        }
        return selectedAnnotationBlock
      })

      const { x1, x2, y1, y2 } = selection.current

      // Reset any of the empty cells after resizing
      if ( !!prevSelection ) {

        // Standardize the previous selection
        prevSelection = utils.standardizeSelection(prevSelection)

        // moving right
        if ( prevSelection.x1 < x1 ) {
          let colIndex = prevSelection.x1
          while ( colIndex < x1 ) {
            let rowIndex = prevSelection.y1
            while ( rowIndex <= prevSelection.y2 ) {
              tableData[rowIndex - 1][colIndex - 1] = {
                ...tableData[rowIndex - 1][colIndex - 1],
                ...DEFAULT_CELL_STATE,
                classNames: [],
              }
              rowIndex += 1
            }
            colIndex += 1
          }
        }

        // moving left
        if ( prevSelection.x2 > x2 ) {
          let colIndex = prevSelection.x2
          while ( colIndex > x2 ) {
            let rowIndex = prevSelection.y1
            while ( rowIndex <= prevSelection.y2 ) {
              tableData[rowIndex - 1][colIndex - 1] = {
                ...tableData[rowIndex - 1][colIndex - 1],
                ...DEFAULT_CELL_STATE,
                classNames: [],
              }
              rowIndex += 1
            }
            colIndex -= 1
          }
        }

        // moving up
        if ( prevSelection.y1 < y1 ) {
          let rowIndex = prevSelection.y1
          while ( rowIndex < y1 ) {
            let colIndex = prevSelection.x1
            while ( colIndex <= prevSelection.x2 ) {
              tableData[rowIndex - 1][colIndex - 1] = {
                ...tableData[rowIndex - 1][colIndex - 1],
                ...DEFAULT_CELL_STATE,
                classNames: [],
              }
              colIndex += 1
            }
            rowIndex += 1
          }
        }

        // moving down
        if ( prevSelection.y2 > y2 ) {
          let rowIndex = prevSelection.y2
          while ( rowIndex > y2 ) {
            let colIndex = prevSelection.x1
            while ( colIndex <= prevSelection.x2 ) {
              tableData[rowIndex - 1][colIndex - 1] = {
                ...tableData[rowIndex - 1][colIndex - 1],
                ...DEFAULT_CELL_STATE,
                classNames: [],
              }
              colIndex += 1
            }
            rowIndex -= 1
          }
        }
      }

      const leftCol = Math.min(x1 - 1, x2 - 1)
      const rightCol = Math.max(x1 - 1, x2 - 1)
      const topRow = Math.min(y1 - 1, y2 - 1)
      const bottomRow = Math.max(y1 - 1, y2 - 1)
      let rowIndex = topRow
      while ( rowIndex <= bottomRow && rowIndex >= 0 && rowIndex < rows.current.length ) {
        let colIndex = leftCol
        while ( colIndex <= rightCol && colIndex >= 0 && colIndex < cols.current.length ) {
          const cellData = tableData[rowIndex][colIndex]
          cellData.classNames = classNames
          cellData.active = true
          cellData.activeTop = false
          cellData.activeLeft = false
          cellData.activeRight = false
          cellData.activeBottom = false
          cellData.activeCorner = false

          // Add a top border to the cells at the top of the selection
          if ( rowIndex === topRow ) {
            cellData.activeTop = true
          }

          // Add a left border to the cells on the left of the selection
          if ( colIndex === leftCol ) {
            cellData.activeLeft = true
          }

          // Add a right border to the cells on the right of the selection
          if ( colIndex === rightCol ) {
            cellData.activeRight = true
          }

          // Add a bottom border to the cells at the bottom of the selection
          if ( rowIndex === bottomRow ) {
            cellData.activeBottom = true
          }

          // Add resize corner to the active selection areas
          if (rowIndex === bottomRow && colIndex === rightCol) {
            cellData.activeCorner = true
          }
          tableData[rowIndex][colIndex] = {...cellData}

          colIndex += 1
        }
        rowIndex += 1
      }
      return tableData
    })
  }, [])

  const scrollToTop = useCallback(() => {
    setScrollToIndex(0)
    setStartIndex(0)
    setStopIndex(99)

    // update annotations
    updateAnnotationBlocks()
  }, [updateAnnotationBlocks])

  const scrollToBottom = useCallback(() => {
    const dims = projectData.table.dims
    const startIndex = dims[0] - 100
    const stopIndex = dims[0] - 1
    loadTableData(startIndex, stopIndex)
    .then(() => {
      setScrollToIndex(dims[0] - 1)
      setStartIndex(startIndex)
      setStopIndex(stopIndex)

      // update annotations
      updateAnnotationBlocks()
    })
  }, [loadTableData, projectData.table.dims, updateAnnotationBlocks])

  const handleOnKeyDown = useCallback(event => {

    // Close annotation menu with ESC key
    if ( event.code === 'Escape' ) {
      hideOverlayMenu()
    }

    // Scroll to top with the `Home` key
    if ( event.code === 'Home' ) {
      scrollToTop()
    }

    // Scroll to bottom with the `end` key
    if ( event.code === 'End' ) {
      scrollToBottom()
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
      if ( event.target.classList.contains('MuiSelect-select') ) { return }
      if ( event.target.nodeName === 'LI' ) { return }

      // Prevent scroll with arrow keys
      event.preventDefault()

      // Hide annotation menu when moving
      setShowOverlayMenu(false)

      setTargetSelection(targetSelection => {

        let nextSelection = targetSelection
        const { x1, x2, y1, y2 } = targetSelection

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
          }
        }

        // arrow down
        if ( event.code === 'ArrowDown' && y1 < rows.current.length ) {
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
          }
        }

        // arrow right
        if ( event.code === 'ArrowRight' && x1 < cols.current.length ) {
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
          resetSelections()
          updateSelections()
          return annotationBlocks
        })

        // make sure we update the target selection highlight
        if ( nextSelection.x1 === targetSelection.x1 ) {
          updateAnnotationBlocks()
        }

        return nextSelection
      })
    }
  }, [
    hideOverlayMenu,
    updateSelections,
    resetSelections,
    selectedAnnotationBlock,
    updateAnnotationBlocks,
    scrollToBottom,
    scrollToTop,
  ])

  const handleOnKeyUp = useCallback(() => {
    clearTimeout(timeoutID.current)
    timeoutID.current = setTimeout(() => {
      setShowOverlayMenu(true)
    }, 350)
  }, [])

  useEffect(() => {
    updateAnnotationBlocks()
  }, [selectedAnnotationBlock, annotationBlocks, updateAnnotationBlocks])

  useEffect(() => {
    if ( !suggestedAnnotations ) { return }

    // show the annotation blocks for the suggested/guessed annotations
    setAnnotationBlocks(annotationBlocks => {

      // remove any previous annotations
      removeAnnotationBlocks(annotationBlocks)

      return suggestedAnnotations
    })

    // submit main subject for automatic wikifiaction
    suggestedAnnotations.forEach(annotation => {
      if ( annotation.role === 'mainSubject' ) {
        wikifyRegion(
          projectData.filepath,
          projectData.sheetName,
          annotation.selection,
          startIndex,
          stopIndex,
        )
        .then(layers => {
          setLayers(layers)

          // Show a success message
          setMessage({
            type: 'success',
            text: 'Countries wikifed automatically!',
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
    })

    // update output data with partial csv
    if ( !!suggestedAnnotations.length ) {
      updateOutputPreview()
    }
  }, [
    suggestedAnnotations,
    projectData.filepath,
    projectData.sheetName,
    updateOutputPreview,
    setMessage,
    startIndex,
    stopIndex,
  ])

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

  const handleOnMouseUp = useCallback(() => {
    if ( selection.current ) {
      selection.current = utils.standardizeSelection(selection.current)
      setAnnotationBlocks(annotationBlocks => {
        setSelectedAnnotationBlock(selectedAnnotationBlock => {

          // annotation block already selected
          if ( !!selectedAnnotationBlock ) {

            // check for overlaps with other blocks
            const allSelections = annotationBlocks.filter(block =>
              block.id !== selectedAnnotationBlock.id
            ).map(block => block.selection)
            const collisionDetected = utils.checkOverlaps(
              selection.current,
              allSelections,
            )

            // hide the overlay meny if users are resizing with overlaps
            if ( !!selectedAnnotationBlock && collisionDetected ) {
              // resizing one of the annotation blocks overlaps another block
              if ( !utils.areSelectionsEqual(selection.current, selectedAnnotationBlock.selection) ) {
                setShowOverlayMenu(false)
                setSelectedAnnotationBlock(undefined)
                setTargetSelection(undefined)
                updateSelections(selection.current)
                updateAnnotationBlocks()
                resetSelections()
              }
            }
          } else {

            // no annotation selected / this is a new annotation block
            // check for overlaps with existing annotation blocks
            const allSelections = annotationBlocks.map(block => block.selection)
            const collisionDetected = utils.checkOverlaps(
              selection.current,
              allSelections,
            )

            // hide the overlay meny and cancel selection if there are overlaps
            if ( collisionDetected ) {
              setShowOverlayMenu(false)
              setSelectedAnnotationBlock(undefined)
              setTargetSelection(undefined)
              updateSelections(selection.current)
              updateAnnotationBlocks()
              resetSelections()
            }
          }

          // user is opening overlay menu for the first time
          setShowOverlayMenu(showOverlayMenu => {
            if ( !showOverlayMenu ) {
              // set the selected overlay menu tab to either cell or block
              if ( utils.singleCellSelection(selection.current) ) {
                setSelectedTab('cell') // user selected a single cell
              } else {
                setSelectedTab('block') // user selected a block
              }
            }

            // show the overlay menu when creating a new annotation
            // show the overlay menu when selecting an existing annotation
            return true
          })

          return selectedAnnotationBlock
        })
        return annotationBlocks
      })
    }
    setUserSelecting(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  }, [handleOnKeyDown, handleOnKeyUp, handleOnMouseUp])

  const handleOnMouseDown = event => {
    let element = event.target

    // Allow users to select the resize-corner of the cell
    if ( element.className === 'cell-resize-corner' ) {
      prevElement.current = element.parentElement
      setShowOverlayMenu(false)
      setUserSelecting(true)
      element = element.parentElement

      const x1 = parseInt(element.dataset.colIndex)
      const x2 = parseInt(element.dataset.colIndex)
      const y1 = parseInt(element.dataset.rowIndex)
      const y2 = parseInt(element.dataset.rowIndex)
      if ( !x1 || !x2 || !y1 || !y2 ) { return }
      const newSelection = { x1, x2, y1, y2 }

      // check if the user is selecting an annotation block
      const selectedBlock = utils.checkSelectedAnnotationBlocks(newSelection, annotationBlocks)
      if ( selectedBlock ) {

        // Reset annotation menu
        if ( selectedBlock !== selectedAnnotationBlock ) {

          // Set the selection to be that of the selected annotation block
          setSelectedAnnotationBlock(selectedBlock)
          selection.current = selectedBlock.selection

          // set the target cell to be top-left of the selection block
          const target = {
            x1: selection.current.x1,
            x2: selection.current.x2,
            y1: selection.current.y1,
            y2: selection.current.y2,
          }
          setTargetSelection(target)
        } else {
          updateAnnotationBlocks()
        }
      }

      updateSelections()
      resetSelections()

      return
    }

    // Set both coordinates to the same cell
    const x1 = parseInt(element.dataset.colIndex)
    const x2 = parseInt(element.dataset.colIndex)
    const y1 = parseInt(element.dataset.rowIndex)
    const y2 = parseInt(element.dataset.rowIndex)
    if ( !x1 || !x2 || !y1 || !y2 ) { return }
    const newSelection = { x1, x2, y1, y2 }
    setTargetSelection(newSelection)

    // check if the user is selecting an annotation block
    const selectedBlock = utils.checkSelectedAnnotationBlocks(newSelection, annotationBlocks)
    if ( selectedBlock ) {

      // Reset annotation menu
      if ( selectedBlock !== selectedAnnotationBlock ) {
        setSelectedAnnotationBlock(selectedBlock)
        selection.current = selectedBlock.selection
      } else {
        updateAnnotationBlocks()
      }

      resetSelections()
      updateSelections()

      return
    }

    // Activate the selection mode
    setUserSelecting(true)
    resetSelections()

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
      selection.current = { x1, x2, y1, y2 }
    }

    // Initialize the previous element with the one selected
    prevElement.current = element
    updateSelections()
  }

  const handleOnMouseMove = event => {
    const element = event.target
    if ( element === prevElement.current ) { return }

    const newColIndex = parseInt(element.dataset.colIndex)
    const newRowIndex = parseInt(element.dataset.rowIndex)

    // Don't allow out-of-bounds selecting / resizing
    if ( !newColIndex || newColIndex === 0 ) { return }
    if ( !newRowIndex || newRowIndex === 0 ) { return }

    if ( userSelecting && !event.shiftKey ) {
      if ( !selection.current ) { return }

      const prevSelection = {...selection.current}

      // Update the last x and y coordinates of the selection
      selection.current = {
        ...selection.current,
        x2: newColIndex,
        y2: newRowIndex,
      }

      // Update Selections
      updateSelections(prevSelection)

      // Update reference to the previous element
      prevElement.current = element
    }
  }

  const removeAnnotationBlocks = annotationBlocks => {
    if ( !annotationBlocks.length ) { return }
    setTableData(prevTableData => {
      const tableData = {...prevTableData}
      annotationBlocks.forEach(annotationBlock => {
        const { x1, x2, y1, y2 } = annotationBlock.selection
        const leftCol = Math.min(x1, x2)
        const rightCol = Math.max(x1, x2)
        const topRow = Math.min(y1, y2)
        const bottomRow = Math.max(y1, y2)
        let rowIndex = topRow
        while ( rowIndex <= bottomRow ) {
          if ( !!tableData[rowIndex - 1] ) {
            let colIndex = leftCol
            while ( colIndex <= rightCol ) {
              if ( !!tableData[rowIndex - 1][colIndex - 1] ) {
                tableData[rowIndex - 1][colIndex - 1] = {
                  ...tableData[rowIndex - 1][colIndex - 1],
                  ...DEFAULT_CELL_STATE,
                  annotation: false,
                  classNames: [],
                  qnode: null,
                }
                colIndex += 1
              }
            }
            rowIndex += 1
          }
        }
      })
      return tableData
    })
  }

  const updateAnnotations = (annotations, deletedAnnotationBlock=null) => {
    if ( annotations && annotations instanceof Array ) {

      // update annotation blocks
      setAnnotationBlocks(annotationBlocks => {
        if ( deletedAnnotationBlock ) {
          removeAnnotationBlocks([deletedAnnotationBlock])
        }
        if ( !!selection.current ) {
          const selectedAnnotations = utils.findSelectedAnnotation(annotations, selection.current)
          // if multiple annotation selections match, select the first one
          if ( !!selectedAnnotations.length ) {
            setSelectedAnnotationBlock(selectedAnnotations[0])
          }
        }
        return annotations
      })

      // remove wikified region and update layers
      if ( deletedAnnotationBlock ) {
          deleteWikifiedRegion(
            projectData.filepath,
            projectData.sheetName,
            deletedAnnotationBlock.selection,
          )
          .then(layers => {
            setLayers(layers)

            // Show a success message
            setMessage({
              type: 'success',
              text: 'Removed wikified region!',
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

      updateOutputPreview()
    }
  }

  const renderTable = () => {
    if ( !tableData ) { return }
    return (
      <Paper className={classes.tableWrapper}
        onMouseDown={handleOnMouseDown}
        onMouseMove={handleOnMouseMove}>
        <AutoSizer>
          {({ height, width }) => (
            <VirtualizedTable
              width={cols.current.length * 77.5}
              height={height}
              headerHeight={26}
              rowHeight={25}
              className={userSelecting ? 'active': ''}
              rowCount={Object.keys(tableData).length}
              scrollToIndex={scrollToIndex}
              rowGetter={({ index }) => rowGetter(index)}>
              <Column
                label=''
                dataKey=''
                headerRenderer={data => <div>&nbsp;</div>}
                width={50}
                cellDataGetter={data => {
                  return data.rowData[data.dataKey]
                }}
                cellRenderer={data => {
                  return <div>{data.rowIndex + 1}</div>
                }}
              />
              {Object.keys(tableData[0]).map((r, i) => (
                <Column key={`col-${i}`}
                  label={utils.columnToLetter(i + 1)}
                  dataKey={i}
                  headerRenderer={data => {
                    return (
                      <div
                        data-row-index={0}
                        data-col-index={i+1}
                        onDoubleClick={handleOnClickHeader}>
                        {data.label}
                      </div>
                    )
                  }}
                  width={100}
                  cellDataGetter={data => {
                    return data.rowData[data.dataKey]
                  }}
                  cellRenderer={data => {
                    return (
                      <TableCell {...data} />
                    )
                  }}
                />
              ))}
            </VirtualizedTable>
          )}
        </AutoSizer>
      </Paper>
    )
  }

  const handleOnSelectionChange = newSelection => {
    const prevSelection = {...selection.current}
    selection.current = {...newSelection}
    resetSelections()
    updateSelections(prevSelection)
  }

  const renderOverlayMenu = () => {
    if ( !targetSelection || !selection.current || !showOverlayMenu ) { return }
    const selectedCell = {...tableData[targetSelection.y1-1][targetSelection.x1-1]}
    return (
      <OverlayMenu
        file={projectData.filepath}
        sheet={projectData.sheetName}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        selectedCell={selectedCell}
        targetSelection={{...targetSelection}}
        selection={selection.current}
        annotations={annotationBlocks}
        updateQnodeLayer={updateQnodeLayer}
        suggestedAnnotation={suggestedAnnotation}
        submitNewAnnotation={submitNewAnnotation}
        updateTableDataLayers={updateTableDataLayers}
        selectedAnnotation={selectedAnnotationBlock}
        onSelectionChange={handleOnSelectionChange}
        updateOutputPreview={updateOutputPreview}
        updateAnnotations={updateAnnotations}
        hideOverlayMenu={hideOverlayMenu}
        setMessage={setMessage}
        startIndex={startIndex}
        stopIndex={stopIndex} />
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
