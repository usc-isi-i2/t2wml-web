import { ROLES, TYPES } from '../content/annotation-options'

export const columnToLetter = column => {
  let temp, letter = ''
  while ( column > 0 ) {
    temp = ( column - 1 ) % 26
    letter = String.fromCharCode(temp + 65) + letter
    column = ( column - temp - 1 ) / 26
  }
  return letter
}


export const letterToColumn = letter => {
  letter = letter.toUpperCase()
  let column = 0
  const length = letter.length
  let counter = 0
  while ( counter < length ) {
    column += (letter.charCodeAt(counter) - 64) * Math.pow(26, length - counter - 1)
    counter += 1
  }
  return column
}


export const standardizeSelection = selection => {
  let temp
  if ( selection.x2 < selection.x1 ) {
    temp = selection.x1
    selection.x1 = selection.x2
    selection.x2 = temp
  }
  if ( selection.y2 < selection.y1 ) {
    temp = selection.y1
    selection.y1 = selection.y2
    selection.y2 = temp
  }
  return selection
}


export const checkOverlaps = (selection, blocks) => {
  if ( !selection ) { return }
  const { x1, y1, x2, y2 } = selection

  // Get the coordinates of the sides
  const aTop = y1 <= y2 ? y1 : y2
  const aLeft = x1 <= x2 ? x1 : x2
  const aRight = x2 >= x1 ? x2 : x1
  const aBottom = y2 >= y1 ? y2 : y1

  for ( const block of blocks ) {
    // Get the coordinates of the sides
    const bTop = block.y1 <= block.y2 ? block.y1 : block.y2
    const bLeft = block.x1 <= block.x2 ? block.x1 : block.x2
    const bRight = block.x2 >= block.x1 ? block.x2 : block.x1
    const bBottom = block.y2 >= block.y1 ? block.y2 : block.y1

    // check for collisions between area A and B
    if ( aTop > bBottom ) {
      continue
    }
    if ( aBottom < bTop ) {
      continue
    }
    if ( aLeft > bRight ) {
      continue
    }
    if ( aRight < bLeft ) {
      continue
    }

    // collision detected
    return true
  }

  // no collisions detected
  return false
}


export const checkSelectedAnnotationBlocks = (selection, blocks) => {
  // checks if a given selection is part of an annotation block
  // if so, returns the annotation block

  const { x1, x2, y1, y2 } = selection
  for ( const block of blocks ) {
    if ( block.selection['y1'] <= block.selection['y2'] ) {
      if ( block.selection['x1'] <= block.selection['x2'] ) {
        if ( x1 >= block.selection['x1'] &&
          x2 <= block.selection['x2'] &&
          y1 >= block.selection['y1'] &&
          y2 <= block.selection['y2'] ) {
          return block
        }
      } else {
        if ( x1 <= block.selection['x1'] &&
          x2 >= block.selection['x2'] &&
          y1 >= block.selection['y1'] &&
          y2 <= block.selection['y2']) {
          return block
        }
      }
    } else {
      if ( block.selection['x1'] <= block.selection['x2'] ) {
        if ( x1 >= block.selection['x1'] &&
          x2 <= block.selection['x2'] &&
          y1 <= block.selection['y1'] &&
          y2 >= block.selection['y2'] ) {
          return block
        }
      } else {
        if ( x1 <= block.selection['x1'] &&
          x2 >= block.selection['x2'] &&
          y1 <= block.selection['y1'] &&
          y2 >= block.selection['y2'] ) {
          return block
        }
      }
    }
  }
  return null
}


export const humanReadableSelection = selection => {
  const { x1, y1, x2, y2 } = selection
  let text = ''
  if ( x1 === x2 && y1 === y2 ) {
    text += `${columnToLetter(x1)}${y1}`
  } else {
    if ( x1 <= x2 ) {
      text += `${columnToLetter(x1)}${y1 <= y2 ? y1 : y2}`
      text += `:${columnToLetter(x2)}${y1 <= y2 ? y2 : y1}`
    } else {
      text += ` ${columnToLetter(x2)}${y2 <= y1 ? y2 : y1}`
      text += `:${columnToLetter(x1)}${y2 <= y1 ? y1 : y2}`
    }
  }
  return text
}


export const isBlock = selection => {
  return !(selection.x1 === selection.x2 && selection.y1 === selection.y2)
}


export const selectionHasData = (data, selection) => {
  const { x1, x2, y1, y2 } = selection.current
  const leftCol = Math.min(x1-1, x2-1)
  const rightCol = Math.max(x1-1, x2-1)
  const topRow = Math.min(y1-1, y2-1)
  const bottomRow = Math.max(y1-1, y2-1)
  let rowIndex = topRow
  while ( rowIndex <= bottomRow ) {
    let colIndex = leftCol
    while ( colIndex <= rightCol ) {
      if ( !!data[rowIndex] && !!data[rowIndex][colIndex] ) {
        return true
      }
      colIndex += 1
    }
    rowIndex += 1
  }
  return false
}


export const parseSelectedRangeInput = value => {
  const regex = /([a-z]+)([0-9]+):?([a-z]+)?([0-9]+)?$/gmi
  const groups = regex.exec(value)
  if ( groups && groups[1] && groups[2] && !groups[3] && !groups[4] ) {
    return {
      x1: letterToColumn(groups[1]),
      x2: letterToColumn(groups[1]),
      y1: parseInt(groups[2]),
      y2: parseInt(groups[2]),
    }
  }
  if ( groups && groups[1] && groups[2] && groups[3] && groups[4] ) {
    return {
      x1: letterToColumn(groups[1]),
      x2: letterToColumn(groups[3]),
      y1: parseInt(groups[2]),
      y2: parseInt(groups[4]),
    }
  }
}


export const isWikifyable = annotation => {

  // check if the annotation role is wikifyable
  const ROLE = ROLES.find(role => role.value === annotation.role)
  if ( ROLE && ROLE.wikify ) {
    return true
  }

  // check if the annotation type is wikifyable
  const TYPE = TYPES.find(type => type.value === annotation.type)
  if ( TYPE && TYPE.wikify ) {
    return true
  }

  return false
}
