const fetchEntity = (qnode, file, sheet) => {
  let url = `/api/causx/entity/${qnode.id}`
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
        'Authentication': sessionStorage.getItem('token'),
      },
    })
    .then(response => response.json())
    .then(data => {
      if ( !!data.error ) {
        reject(data.error)
      }
      resolve(data.entity)
    })
    .catch(error => reject(error))
  })
}

export default fetchEntity
