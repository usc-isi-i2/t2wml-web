const wikifyRegion = (file, sheet, selection) => {
  let url = '/api/causx/wikify_region'
  url += `?project_folder=/proj`
  url += `&data_file=${file}`
  url += `&sheet_name=${sheet}`

  const requestData = {
    selection: selection,
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
      resolve(data.layers)
    })
  })
}


export default wikifyRegion
