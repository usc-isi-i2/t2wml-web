import React, { useEffect, useState } from 'react'

import { Grid, LinearProgress } from '@material-ui/core'

import FileHeader from './FileHeader'
import uploadFile from '../utils/uploadFile'
import readFile from '../utils/readFile'


const FileUpload = ({file, onUpload, onDelete}) => {

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let isMounted = true
    uploadFile(file, setProgress).then(data => {
      if ( isMounted ) {
        onUpload(data)
      }
    }).catch(() => {
      if ( isMounted ) {
        readFile(file).then(data => {
          onUpload(data)
        })
      }
    })
    return () => {
      isMounted = false
    }
  }, [file, onUpload])

  return (
    <Grid item>
      <FileHeader file={file} onDelete={onDelete} />
      <LinearProgress variant="determinate" value={progress} />
    </Grid>
  )
}


export default FileUpload
