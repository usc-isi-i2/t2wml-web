const fetchProject = () => {
  let url = '/api/causx/project/settings'

  if ( process.env.REACT_APP_BACKEND_URL ) {
    url = `${process.env.REACT_APP_BACKEND_URL}${url}`
  }

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET'
      headers: {
        'Authentication', localStorage.getItem('token'),
      },
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


export default fetchProject
