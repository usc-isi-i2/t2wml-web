const fetchToken = () => {
  let url = '/api/causx/token'

  if ( process.env.REACT_APP_BACKEND_URL ) {
    url = `${process.env.REACT_APP_BACKEND_URL}${url}`
  }

  return new Promise((resolve, reject) => {
    fetch(url, {method: 'GET'})
      .then(response => response.json())
      .then(response => {
        resolve(response.token)
      })
  })
}


export default fetchToken
