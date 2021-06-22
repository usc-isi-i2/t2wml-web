const wikifyRegion = (file, sheet) => {
  let url = '/api/web/wikify_region'
  url += `?project_folder=/proj`
  url += `&data_file=${file}`
  url += `&sheet_name=${sheet}`

  const requestData = {
    selection: {x1: 1, x2: 1, y1: 4, y2: 19},
    overwrite: true,
  }

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
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


export default wikifyRegion
