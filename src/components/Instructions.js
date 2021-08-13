import React from 'react'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { makeStyles } from '@material-ui/styles'


const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
}))


const Instructions = () => {

  const classes = useStyles()

  const renderInstructions = () => {
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

  return (
    <React.Fragment>
      {renderInstructions()}
    </React.Fragment>
  )
}


export default Instructions
