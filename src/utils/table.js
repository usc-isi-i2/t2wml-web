export function columnToLetter(column) {
  let temp, letter = ''
  while (column > 0) {
    temp = (column - 1) % 26
    letter = String.fromCharCode(temp + 65) + letter
    column = (column - temp - 1) / 26
  }
  return letter
}


export function standardizeSelection(selection) {
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


export function checkOverlaps(selection, blocks) {
  if ( !selection ) { return }
  const { x1, y1, x2, y2 } = selection

  // Get the coordinates of the sides
  const aTop = y1 <= y2 ? y1 : y2
  const aLeft = x1 <= x2 ? x1 : x2
  const aRight = x2 >= x1 ? x2 : x1
  const aBottom = y2 >= y1 ? y2 : y1

  for (let i = 0; i < blocks.length; i++ ) {
    const other = blocks[i].selection;

    // Get the coordinates of the sides
    const bTop = other.y1 <= other.y2 ? other.y1 : other.y2;
    const bLeft = other.x1 <= other.x2 ? other.x1 : other.x2;
    const bRight = other.x2 >= other.x1 ? other.x2 : other.x1;
    const bBottom = other.y2 >= other.y1 ? other.y2 : other.y1;

    // check for collisions between area A and B
    if (aTop > bBottom) {
      continue;
    }
    if (aBottom < bTop) {
      continue;
    }
    if (aLeft > bRight) {
      continue;
    }
    if (aRight < bLeft) {
      continue;
    }

    // collision detected
    return true;
  }

  // no collisions detected
  return false;
}
