const uploadAnnotations = (file, sheet, annotations, onProgress) => {
  let url = '/api/causx/annotation'
  url += `?data_file=${file}`
  url += `&sheet_name=${sheet}`

  if ( process.env.REACT_APP_BACKEND_URL ) {
    url = `${process.env.REACT_APP_BACKEND_URL}${url}`
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.open('POST', url)

    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    xhr.setRequestHeader('Authentication', sessionStorage.getItem('token'))

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText)
        if ( 'error' in response ) {
          reject(response.error)
        } else {
          resolve(response)
        }
      } catch (error) {
        reject(error)
      }
    }

    xhr.onerror = event => reject(event)

    xhr.upload.onprogress = event => {
      if ( event.lengthComputable ) {
        const percentage = (event.loaded / event.total) * 100
        onProgress(Math.round(percentage))
      }
    }

    xhr.send(JSON.stringify({
      'title': 'web.annotation',
      'annotations': annotations,
    }))
  })
}


export default uploadAnnotations
