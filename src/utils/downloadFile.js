const downloadFile = (data, filename) => {

  const csvContent = 'data:text/csv;charset=utf-8,' + data

  const link = document.createElement('a')
  if ( link.download !== undefined ) { // feature detection
    link.setAttribute('href', encodeURI(csvContent))
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}


export default downloadFile
