const uploadAnnotations = (file, sheet, annotations, onProgress) => {
  let url = '/api/annotation?project_folder=/proj'
  url += `&data_file=${file}`
  url += `&sheet_name=${sheet}`

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.open('POST', url)

    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')

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
