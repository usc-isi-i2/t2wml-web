const fetchAnnotations = (file, sheet) => {
  let url = '/api/annotation/guess-blocks'
  url += `?project_folder=/proj`
  url += `&data_file=${file}`
  url += `&sheet_name=${sheet}`
  url += `&mapping_file=web.annotation`
  url += `&mapping_type=Annotation`

  return new Promise((resolve, reject) => {
    fetch(url, {method: 'GET'})
      .then((response) => response.json())
      .then((response) => {
        if ( !!response.error ) {
          reject(response.error)
        }
        resolve(response.data)
      })
  })
}


export default fetchAnnotations
