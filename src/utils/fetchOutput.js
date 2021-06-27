const fetchOutput = (file, sheet, fileType) => {
  let url
  if ( fileType === 't2wmlz' ) {
    url = '/api/causx/download_project'
  } else {
    url = '/api/causx/project/download/'
    url += `${fileType}/${file}_output.${fileType}`
  }
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


export default fetchOutput
