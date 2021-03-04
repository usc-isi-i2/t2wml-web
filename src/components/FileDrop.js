import React, { useCallback, useState } from 'react'

import { Grid, makeStyles } from '@material-ui/core'
import {useDropzone} from 'react-dropzone'


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
    setFiles(prev => [...prev, acceptedFiles])
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
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
  )
}


export default FileDrop
