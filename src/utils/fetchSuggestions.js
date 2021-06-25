const fetchSuggestions = (file, sheet, selection, annotations) => {
  let url = '/api/causx/annotation/suggest?project_folder=/proj'
  url += `&data_file=${file}`
  url += `&sheet_name=${sheet}`

  const requestData = {
    annotations,
    selection,
  }

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
