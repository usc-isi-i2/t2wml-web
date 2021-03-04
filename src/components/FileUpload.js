import React, { useEffect, useState } from 'react'

import { Grid, LinearProgress } from '@material-ui/core'

import FileHeader from './FileHeader'
import uploadFile from '../utils/uploadFile'


const FileUpload = ({file, onUpload, onDelete}) => {

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    uploadFile(file, setProgress).then(() => {
      onUpload(file)
    })
  }, [file, onUpload])

  return (
    <Grid item>
      <FileHeader file={file} onDelete={onDelete} />
      <LinearProgress variant="determinate" value={progress} />
    </Grid>
  )
}


export default FileUpload
