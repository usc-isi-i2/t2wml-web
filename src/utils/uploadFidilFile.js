const uploadFidilFile = (file, sheet) => {
  let url = '/api/causx/project/upload_fidil_json/'
  url += `?data_file=${file}`
  url += `&sheet_name=${sheet}`

  if ( process.env.REACT_APP_BACKEND_URL ) {
    url = `${process.env.REACT_APP_BACKEND_URL}${url}`
  }

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': sessionStorage.getItem('token'),
      },
    })
    .then(response => response.json())
    .then(response => {
      resolve(response)
    })
  })
}


export default uploadFidilFile
