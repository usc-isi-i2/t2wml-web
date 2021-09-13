const downloadFile = (project, file, sheet, fileType, url) => {
  url += `?data_file=${file}`
  url += `&sheet_name=${sheet}`
  url += `&mapping_file=web.annotation`
  url += `&mapping_type=Annotation`

  if ( process.env.REACT_APP_BACKEND_URL ) {
    url = `${process.env.REACT_APP_BACKEND_URL}${url}`
  }

  const filename = `${project.title}_${Date.now()}.${fileType}`

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: {
        'Authentication': sessionStorage.getItem('token'),
      },
      cache: 'no-store',
    })
    .then(response => response.blob())
    .then(blob => {
      if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(blob, filename)
      } else {
        const link = document.createElement('a')
        if ( link.download !== undefined ) { // feature detection
          link.setAttribute('href', URL.createObjectURL(blob))
          link.setAttribute('download', filename)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    })
  })
}


export default downloadFile
