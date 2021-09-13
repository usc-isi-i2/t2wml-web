const uploadSettings = (settings) => {
  let url = '/api/causx/project/settings'

  if ( process.env.REACT_APP_BACKEND_URL ) {
    url = `${process.env.REACT_APP_BACKEND_URL}${url}`
  }

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
        'Authentication': sessionStorage.getItem('token'),
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
