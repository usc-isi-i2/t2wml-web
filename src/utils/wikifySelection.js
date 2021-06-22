const wikifySelection = (file, sheet) => {
  let url = '/api/auto_wikinodes'
  url += `?project_folder=/proj`
  url += `&data_file=${file}`
  url += `&sheet_name=${sheet}`

  const requestData = {
    selection: {x1: 2, x2: 2, y1: 4, y2: 19},
    is_property: false,
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


export default wikifySelection
