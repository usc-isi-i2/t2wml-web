const downloadFile = (data, filename, fileType) => {

  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })

  if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement('a')
    if ( link.download !== undefined ) { // feature detection
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}


export default downloadFile
