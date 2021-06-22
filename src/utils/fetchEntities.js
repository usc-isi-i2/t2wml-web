const fetchEntities = (file, sheet) => {
  let url = '/api/project/entities?project_folder=/proj'
  url += `&data_file=${file}`
  url += `&sheet_name=${sheet}`

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      if ( !!data.error ) {
        reject(data.error)
      }
      resolve(data)
    })
    .catch(error => reject(error))
  })
}

export default fetchEntities
