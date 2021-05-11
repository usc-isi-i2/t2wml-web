const fetchProperties = (q, type='ngram') => {
  const url = `https://kgtk.isi.edu/api?q=${q}&type=${type}&extra_info=true&language=en&item=property&size=5`

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
      }
      resolve(data)
    })
    .catch(error => reject(error))
  })
}


export default fetchProperties
