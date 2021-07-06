const fetchOutput = (file, sheet, fileType) => {
  let url = '/api/causx/project/download/'
  url += `${fileType}/${file}_output.${fileType}`
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
        resolve(response.data)
      })
  })
}


export default fetchOutput
