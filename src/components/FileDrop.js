import React, { useCallback, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Alert from '@material-ui/lab/Alert'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useDropzone } from 'react-dropzone'

import FileUpload from './FileUpload'
import UploadIcon from '../icons/Upload'

import useStyles from '../styles/fileDrop'


const FileDrop = ({
  onSuccess,
  setMessage,
  filename,
  sheetname,
  uploadAnnotations,
}) => {

  const classes = useStyles()

  const [files, setFiles] = useState([])

  const [errors, setErrors] = useState([])

  const [loading, setLoading] = useState(false)

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

    setLoading(true)
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: [
      '.csv',
      '.t2wmlz',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    maxFiles: 1,
  })

  const onUploadSuccess = data => {
    onSuccess(data)
    setLoading(false)
    setMessage({
      type: 'success',
      text: 'Good news! File uploaded',
    })
  }

  const onUploadError = error => {
    setLoading(false)
    setMessage({
      type: 'error',
      title: `${error.errorCode} - ${error.errorTitle}`,
      text: error.errorDescription,
    })
  }

  const onDelete = file => {
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
          {loading ? (
            <CircularProgress />
          ) : (
            <React.Fragment>
              <UploadIcon width='256' height='256' />
              <Typography variant="h5" align="center">
                click here to upload files
                <br />
                (accepted formats: csv, xlsx, t2wmlz)
              </Typography>
            </React.Fragment>
          )}
        </div>
      </Grid>
      {files.map((file, index) => (
        <Grid item key={index}>
          <FileUpload
            filename={filename}
            sheetname={sheetname}
            onDelete={onDelete}
            onUploadSuccess={onUploadSuccess}
            onUploadError={onUploadError}
            uploadAnnotations={uploadAnnotations}
            file={file}
          />
        </Grid>
      ))}
    </React.Fragment>
  )
}


export default FileDrop
