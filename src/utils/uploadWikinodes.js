const uploadWikinodes = (file, sheet, selection, isProperty, dataType) => {
  let url = '/api/causx/auto_wikinodes?project_folder=/proj'
  url += `&data_file=${file}`
  url += `&sheet_name=${sheet}`

  if ( process.env.REACT_APP_BACKEND_URL ) {
    url = `${process.env.REACT_APP_BACKEND_URL}${url}`
  }

  const requestData = {selection}
  requestData['is_property'] = isProperty
  if ( isProperty ) {
    requestData['data_type'] = dataType
  }

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': localStorage.getItem('token'),
      },
      body: JSON.stringify(requestData),
    })
    .then((response) => response.json())
    .then((response) => {
      if ( !!response.error ) {
        reject(response.error)
      }
      resolve(response.layers)
    })
  })
}


export default uploadWikinodes
