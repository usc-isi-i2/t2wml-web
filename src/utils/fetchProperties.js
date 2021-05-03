const fetchSuggestions = q => {
  const url = `https://kgtk.isi.edu/api?q=${q}&type=ngram&extra_info=true&language=en&item=property`

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


export default fetchSuggestions
