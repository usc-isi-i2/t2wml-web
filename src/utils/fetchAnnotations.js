const fetchAnnotations = (file, sheet, startIndex, stopIndex) => {
  let url = '/api/causx/annotation/guess-blocks'
  url += `?data_file=${file}`
  url += `&sheet_name=${sheet}`
  url += `&mapping_file=web.annotation`
  url += `&mapping_type=Annotation`

  // add start and stop index params
  if ( typeof startIndex === 'number' && typeof stopIndex === 'number' ) {
    url += `&data_start=${startIndex}`
    url += `&map_start=${startIndex}`
    url += `&data_end=${stopIndex}`
    url += `&map_end=${stopIndex}`
  }

  if ( process.env.REACT_APP_BACKEND_URL ) {
    url = `${process.env.REACT_APP_BACKEND_URL}${url}`
  }

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: {
        'Authentication': sessionStorage.getItem('token'),
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
