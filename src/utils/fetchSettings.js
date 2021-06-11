const fetchSettings = () => {
  let url = '/api/project/settings'
  url += `?project_folder=/proj`

  return new Promise((resolve, reject) => {
    fetch(url, {method: 'GET'})
      .then((response) => response.json())
      .then((response) => {
        if ( !!response.error ) {
          reject(response.error)
        }
        resolve(response.project)
      })
  })
}


export default fetchSettings
