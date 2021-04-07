import React from 'react'
import { Button, Grid, Paper } from '@material-ui/core'

import useStyles from '../styles/fileHeader'


const FileHeader = ({file, onDelete}) => {

  const classes = useStyles()

  return (
    <Paper className={classes.fileHeader}>
      <Grid container justify="space-between" alignItems="center">
        <Grid item className="">{file.name}</Grid>
        <Grid item>
          <Button size="small" onClick={() => onDelete(file)}>
            Delete
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}


export default FileHeader
