import React, { useCallback, useState } from 'react'

import Alert from '@material-ui/lab/Alert'
import { Grid, makeStyles } from '@material-ui/core'
import {useDropzone} from 'react-dropzone'

import FileUpload from './FileUpload'
import UploadIcon from '../icons/Upload'


const useStyles = makeStyles((theme) => ({
  dropzone: {
    display: 'flex',
    flexGrow: '1',
    height: '50vh',
    justifyContent: 'center',
    alignItems: 'center',
    outlineWidth: '0.5em',
    outlineStyle: 'dashed',
    outlineColor: 'rgba(0, 0, 0, 0.25)',
    outlineOffset: '-2em',
    cursor: 'pointer',
    transition: 'all 500ms ease',
    '&> svg': {
      opacity: '0.25',
    },
    '&.active': {
      outlineColor: 'chartreuse',
      outlineOffset: '-3em',
      outlineWidth: '0.6em',
    },
    '&.active > svg': {
      opacity: '0.75',
      fill: 'chartreuse',
      transition: 'all 500ms ease',
    },
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
        <div {...getRootProps({ className: `${classes.dropzone} ${isDragActive ? 'active' : ''}` })}>
          <input {...getInputProps()} />
          <UploadIcon width='256' height='256' />
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
