const fetchSuggestions = (file, sheet, selection, annotations) => {
  let url = '/api/causx/annotation/suggest'
  url += `?data_file=${file}`
  url += `&sheet_name=${sheet}`

  if ( process.env.REACT_APP_BACKEND_URL ) {
    url = `${process.env.REACT_APP_BACKEND_URL}${url}`
  }

  const requestData = {
    annotations,
    selection,
  }

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': sessionStorage.getItem('token'),
      },
      body: JSON.stringify(requestData),
    })
    .then((response) => response.json())
    .then((data) => {
      if ( !!data.error ) {
        reject(data.error)
      }
      resolve(data)
    })
  })
}


export default fetchSuggestions
