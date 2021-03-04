import React, { useCallback, useState } from 'react'

import { Grid, makeStyles } from '@material-ui/core'
import {useDropzone} from 'react-dropzone'

import FileUpload from './FileUpload'


const useStyles = makeStyles((theme) => ({
  dropzone: {
    border: `5px dashed ${theme.palette.secondary.main}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(15),
    outline: 'none',
  },
}))


const FileDrop = () => {

  const classes = useStyles()

  const [files, setFiles] = useState([])

  const onDrop = useCallback(acceptedFiles => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles])
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: ['.csv'],
    maxSize: 1000 * 1024, // 1MB
  })

  function onUpload(file) {
    console.log(file)
  }

  function onDelete(file) {
    setFiles(prevFiles => prevFiles.filter(f => f !== file))
  }

  return (
    <React.Fragment>
      <Grid item>
        <div {...getRootProps({ className: classes.dropzone })}>
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>Drop the files here ...</p> :
              <p>Drag 'n' drop some files here, or click to select files</p>
          }
        </div>
      </Grid>
      {files.map((file, index) => (
        <Grid item key={index}>
          <FileUpload
            onDelete={onDelete}
            onUpload={onUpload}
            file={file}
          />
        </Grid>
      ))}
    </React.Fragment>
  )
}


export default FileDrop
