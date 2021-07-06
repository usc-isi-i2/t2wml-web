const fetchAnnotations = (file, sheet) => {
  let url = '/api/causx/annotation/guess-blocks'
  url += `?data_file=${file}`
  url += `&sheet_name=${sheet}`
  url += `&mapping_file=web.annotation`
  url += `&mapping_type=Annotation`

  if ( process.env.REACT_APP_BACKEND_URL ) {
    url = `${process.env.REACT_APP_BACKEND_URL}${url}`
  }

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: {
        'Authentication': localStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if ( !!response.error ) {
          reject(response.error)
        }
        resolve(response.annotations)
      })
  })
}


export default fetchAnnotations
