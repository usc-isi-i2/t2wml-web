import React, { useCallback, useState } from 'react'

import {useDropzone} from 'react-dropzone'


const FileDrop = () => {

  const [files, setFiles] = useState([])

  const onDrop = useCallback(acceptedFiles => {
    setFiles(prev => [...prev, acceptedFiles])
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}


export default FileDrop
