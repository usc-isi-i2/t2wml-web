import React, { useEffect, useState } from 'react'

import { Grid, LinearProgress } from '@material-ui/core'

import FileHeader from './FileHeader'
import uploadFile from '../utils/uploadFile'
import readFile from '../utils/readFile'


const FileUpload = ({file, onUploadSuccess, onUploadError, onDelete}) => {

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let isMounted = true
    uploadFile(file, setProgress).then(data => {
      if ( isMounted ) {
        onUploadSuccess(data)
      }
    }).catch(() => {
      if ( isMounted ) {
        readFile(file).then(data => {
          onUploadSuccess(data)
        }).catch(() => {
          onUploadError()
        })
      }
    })
    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  return (
    <Grid item>
      <FileHeader file={file} onDelete={onDelete} />
      <LinearProgress variant="determinate" value={progress} />
    </Grid>
  )
}


export default FileUpload
