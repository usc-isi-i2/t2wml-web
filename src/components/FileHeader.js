import React from 'react'
import { Button, Grid, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'


const useStyles = makeStyles(theme => ({
  fileHeader: {
    padding: theme.spacing(3),
    background: 'rgba(0,0,0,0)',
  },
}))


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
