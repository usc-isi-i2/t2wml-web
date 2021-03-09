export const columnToLetter = (column) => {
  let temp, letter = ''
  while ( column > 0 ) {
    temp = ( column - 1 ) % 26
    letter = String.fromCharCode(temp + 65) + letter
    column = ( column - temp - 1 ) / 26
  }
  return letter
}


export const standardizeSelection = (selection) => {
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


export const humanReadableSelection = (selection) => {
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
  return text;
}
