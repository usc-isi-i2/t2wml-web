const uploadUnit = (file, sheet, unit) => {
  let url = 'api/create_node?project_folder=/proj'
  url += `&data_file=${file}`
  url += `&sheet_name=${sheet}`

  const requestData = {
    key: 'P31',
    is_property: false,
    label: unit.unitLabel,
    description: unit.unitDescription,
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


export default uploadUnit
