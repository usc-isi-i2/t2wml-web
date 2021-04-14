const fetchOutput = (file, sheet) => {
  let url = '/api/project/download/csv?project_folder=/proj'
  url += `&data_file=${file}`
  url += `&sheet_name=${sheet}`
  url += `&mapping_file=web.annotation`
  url += `&mapping_type=Annotation`

  return new Promise((resolve, reject) => {
    fetch(url, {method: 'GET'})
      .then((response) => response.json())
      .then((data) => {
        if ( !!data.error ) {
          reject(data.error)
        }
        resolve(data)
      })
  })
}


export default fetchOutput
