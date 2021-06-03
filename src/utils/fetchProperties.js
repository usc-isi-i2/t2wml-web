const fetchProperties = (q, type='ngram') => {
  const url = `https://kgtk.isi.edu/api?q=${q}&type=${type}&extra_info=true&language=en&item=property&size=10`

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
        reject(data.error)
      }
      resolve(data.map(item => ({
        id: item.qnode,
        label: item.label[0],
        description: item.description[0],
        data_type: item.data_type,
      })))
    })
    .catch(error => reject(error))
  })
}


export default fetchProperties
