const uploadEntity = (entity, tags, property, file, sheet) => {
  let url = `/api/causx/entity/${property.id}`
  url += `?data_file=${file}`
  url += `&sheet_name=${sheet}`

  if ( process.env.REACT_APP_BACKEND_URL ) {
    url = `${process.env.REACT_APP_BACKEND_URL}${url}`
  }

  const requestData = {
    updated_entry: {
      ...entity,
      tags: tags.map(tag => `${tag.key}:${tag.value}`),
    },
  }

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': localStorage.getItem('token'),
      },
      body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => {
      if ( !!data.error ) {
        reject(data.error)
      }
      resolve(data.entity)
    })
    .catch(error => reject(error))
  })
}

export default uploadEntity
