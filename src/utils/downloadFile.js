const downloadFile = (data, filename, fileType) => {

  const blob = new Blob([data], {type: 'application/octet-stream'})

  if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename)
  } else {
    const link = document.createElement('a')
    if ( link.download !== undefined ) { // feature detection
      link.setAttribute('href', URL.createObjectURL(blob))
      link.setAttribute('download', `${filename}_output.${fileType}`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}


export default downloadFile
