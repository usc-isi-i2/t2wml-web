const fetchPartialCSV = (file, sheet) => {
  let url = '/api/partialcsv'
  url += `?project_folder=/proj`
  url += `&data_file=${file}`
  url += `&sheet_name=${sheet}`
  url += `&mapping_file=web.annotation`
  url += `&mapping_type=Annotation`

  return new Promise((resolve, reject) => {
    fetch(url, {method: 'GET'})
      .then((response) => response.json())
      .then((response) => {
        debugger
        if ( !!response.error ) {
          reject(response.error)
        }
        resolve(response.partialCsv)
      })
  })
}


export default fetchPartialCSV
