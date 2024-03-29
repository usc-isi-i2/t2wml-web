const wikifyRegion = (file, sheet, selection, startIndex, stopIndex) => {
  let url = '/api/causx/wikify_region'
  url += `?data_file=${file}`
  url += `&sheet_name=${sheet}`

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

  const requestData = {
    selection: selection,
    overwrite: true,
  }

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
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
      resolve(data.layers)
    })
  })
}


export default wikifyRegion
