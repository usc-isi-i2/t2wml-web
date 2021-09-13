const uploadFile = (file, onProgress) => {
  let url = '/api/causx/upload/data'

  if ( process.env.REACT_APP_BACKEND_URL ) {
    url = `${process.env.REACT_APP_BACKEND_URL}${url}`
  }

  // fetch only the first 100 lines of the data file
  url += '?data_start=0&map_start=0&data_end=99&map_end=99'

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)

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

    const formData = new FormData()
    formData.append('file', file)
    xhr.send(formData)
  })
}


export default uploadFile
