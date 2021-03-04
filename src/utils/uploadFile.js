export default function uploadFile(file, onProgress) {
  const url = ''

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)

    xhr.onload = () => {
      const response = JSON.parse(xhr.responseText)
      resolve(response)
    }

    xhr.onerror = (event) => reject(event)

    xhr.upload.onprogress = (event) => {
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
