const fetchPartialCSV = (file, sheet) => {
  let url = '/api/causx/partialcsv'
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
        'Authentication': sessionStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if ( !!response.error ) {
          reject(response.error)
        }
        resolve(response.partialCsv)
      })
  })
}


export default fetchPartialCSV
