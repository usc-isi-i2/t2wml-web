const fetchEntities = (file, sheet) => {
  let url = '/api/causx/project/entities'
  url += `?data_file=${file}`
  url += `&sheet_name=${sheet}`

  if ( process.env.REACT_APP_BACKEND_URL ) {
    url = `${process.env.REACT_APP_BACKEND_URL}${url}`
  }

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': localStorage.getItem('token'),
      },
    })
    .then(response => response.json())
    .then(data => {
      if ( !!data.error ) {
        reject(data.error)
      }
      resolve(data)
    })
    .catch(error => reject(error))
  })
}

export default fetchEntities
