import React, { useCallback, useState } from 'react'

import Alert from '@material-ui/lab/Alert'
import { Grid } from '@material-ui/core'
import { useDropzone } from 'react-dropzone'

import FileUpload from './FileUpload'
import UploadIcon from '../icons/Upload'

import useStyles from '../styles/fileDrop'


const FileDrop = ({ onSuccess, setMessage }) => {

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
    accept: [
      '.csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    maxSize: 5000 * 1024, // 5MB
    maxFiles: 1,
  })

  function onUploadSuccess(data) {
    onSuccess(data)
    setMessage({
      type: 'success',
      text: 'Good news! File uploaded',
    })
  }

  function onUploadError(error) {
    setMessage({
      type: 'error',
      title: `${error.errorCode} - ${error.errorTitle}`,
      text: error.errorDescription,
    })
  }

  function onDelete(file) {
    setFiles(prevFiles => prevFiles.filter(f => f !== file))
  }

  return (
    <React.Fragment>
      {errors.map((error, index) => (
        <Grid key={index} style={{ margin: 20 }}>
          <Alert variant="outlined" severity="error">
            {error}
          </Alert>
        </Grid>
      ))}
      <Grid item>
        <div {...getRootProps({ className: `${classes.dropzone} ${isDragActive ? 'active' : ''}` })}>
          <input {...getInputProps()} autoFocus={true} tabIndex="0" />
          <UploadIcon width='256' height='256' />
        </div>
      </Grid>
      {files.map((file, index) => (
        <Grid item key={index}>
          <FileUpload
            onDelete={onDelete}
            onUploadSuccess={onUploadSuccess}
            onUploadError={onUploadError}
            file={file}
          />
        </Grid>
      ))}
    </React.Fragment>
  )
}


export default FileDrop
