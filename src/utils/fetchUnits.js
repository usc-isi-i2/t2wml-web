const fetchUnits = q => {
  const url = `https://kgtk.isi.edu/api?q=${q}&type=ngram&extra_info=true&language=en&item=qnode&size=10&instance_of=Q47574`

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
      })))
    })
    .catch(error => reject(error))
  })
}


export default fetchUnits
