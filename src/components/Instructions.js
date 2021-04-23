import React from 'react'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { makeStyles } from '@material-ui/styles'


const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
  },
}))


const Instructions = () => {

  const classes = useStyles()

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6">
        In order to annotate the data:
      </Typography>
      <Typography variant="h6">
        1. Select the main subject
      </Typography>
      <Typography variant="h6">
        2. Select the dependent variable
      </Typography>
      <Typography variant="h6">
        3. Select data properties and qualifiers
      </Typography>
    </Paper>
  )
}


export default Instructions
