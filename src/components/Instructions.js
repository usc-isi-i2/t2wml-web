import React from 'react'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/styles'

import classNames from '../utils/classNames'


const useStyles = makeStyles(theme => ({
  instructions: {
    padding: theme.spacing(3),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    '&.loading': {
      opacity: 0.5,
    },
  },
  loading: {
    position: 'absolute',
    top: 'calc(50% - 25px)',
    left: 'calc(50% - 25px)',
    color: theme.palette.type === 'dark' ? '#fefefe' : '#777',
  },
}))


const Instructions = ({ loading }) => {

  const classes = useStyles()

  const renderInstructions = () => {
    return (
      <Paper className={classNames(classes.instructions, {loading})}>
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

  const renderLoading = () => {
    if ( !loading ) { return }
    return (
      <CircularProgress
        size={50}
        color="inherit"
        className={classes.loading} />
    )
  }

  return (
    <React.Fragment>
      {renderInstructions()}
      {renderLoading()}
    </React.Fragment>
  )
}


export default Instructions
