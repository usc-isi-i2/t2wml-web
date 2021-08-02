import React, { useEffect, useState } from 'react'

import { Grid, LinearProgress } from '@material-ui/core'

import FileHeader from './FileHeader'
import uploadFile from '../utils/uploadFile'
import uploadAnnotationsFile from '../utils/uploadAnnotationsFile'


const FileUpload = ({
  file,
  filename,
  sheetname,
  onUploadSuccess,
  onUploadError,
  onDelete,
  uploadAnnotations,
}) => {

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let isMounted = true
    if ( uploadAnnotations ) {
      uploadAnnotationsFile(file, filename, sheetname, setProgress).then(data => {
        if ( isMounted ) {
          onUploadSuccess(data)
        }
      }).catch(error => {
        if ( isMounted ) {
          onUploadError(error)
        }
      })
    } else {
      uploadFile(file, setProgress).then(data => {
        if ( isMounted ) {
          onUploadSuccess(data)
        }
      }).catch(error => {
        if ( isMounted ) {
          onUploadError(error)
        }
      })
    }
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
