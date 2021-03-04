import React, { useCallback, useState } from 'react'

import Alert from '@material-ui/lab/Alert'
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

  const [errors, setErrors] = useState([])

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles])

    if ( !!rejectedFiles ) {
      const errors = []
      rejectedFiles.forEach(rejectedFile => {
        rejectedFile.errors.forEach(error => {
          const message = `${rejectedFile.file.name}: ${error.message}`
          errors.push(message)
          setTimeout(() => {
            setErrors(prevErrors =>
              prevErrors.filter(error => error !== message)
            )
          }, 3000)
        })
      })
      setErrors(prevErrors => [...prevErrors, ...errors])
    }
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
      {errors.map((error, index) => (
        <Grid item key={index}>
          <Alert variant="outlined" severity="error">
            {error}
          </Alert>
        </Grid>
      ))}
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
