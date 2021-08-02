const uploadFidilFile = (file, sheet, unit) => {
  let url = '/api/causx/project/upload/fidil_json'
  url += `?data_file=${file}`
  url += `&sheet_name=${sheet}`

  if ( process.env.REACT_APP_BACKEND_URL ) {
    url = `${process.env.REACT_APP_BACKEND_URL}${url}`
  }

  return new Promise((resolve, reject) => {
    fetch(url, {method: 'GET'})
    .then(response => response.json())
    .then(response => {
      resolve(response)
    })
  })
}


export default uploadFidilFile