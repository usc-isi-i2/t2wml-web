const uploadSettings = (settings) => {
  let url = 'api/project/settings?project_folder=/proj'

  const requestData = {
    title: settings.title,
    description: settings.description,
    url: settings.url,
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
    .then((response) => {
      if ( !!response.error ) {
        reject(response.error)
      }
      resolve(response.project)
    })
  })
}


export default uploadSettings
