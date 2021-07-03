const uploadProperty = (file, sheet, property) => {
  let url = '/api/causx/create_node?project_folder=/proj'
  url += `&data_file=${file}`
  url += `&sheet_name=${sheet}`

  if ( process.env.REACT_APP_BACKEND_URL ) {
    url = `${process.env.REACT_APP_BACKEND_URL}${url}`
  }

  const requestData = {
    is_property: true,
    label: property.qnodeLabel,
    description: property.qnodeDescription,
    data_type: property.qnodeType,
  }

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
    .then((response) => response.json())
    .then((data) => {
      if ( !!data.error ) {
        reject(data.error)
      }
      if ( !!data.entity ) {
        resolve({
          id: data.entity.id,
          label: [data.entity.label],
          description: [data.entity.description],
        })
      }
      reject('Err! No entity found in the response data')
    })
  })
}


export default uploadProperty
