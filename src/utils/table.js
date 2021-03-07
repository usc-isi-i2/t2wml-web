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
