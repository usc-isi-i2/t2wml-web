import React from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import QnodeInput from './QnodeInput'
import * as utils from '../utils/table'


const useStyles = makeStyles(theme => ({
  form: {
    width: '100%',
    minHeight: '250px',
    marginTop: theme.spacing(1),
  },
}))


const WikificationMenu = ({
  hideMenu,
  selection,
  selectedCell,
}) => {

  const classes = useStyles()

  const handleOnSubmit = () => {}

  const handleOnSelectQnode = () => {}

  const renderCellContent = () => {
    return (
      <Grid item xs={12}>
        <Typography variant="body1">
          {utils.humanReadableSelection(selectedCell)}: {selectedCell.value}
        </Typography>
      </Grid>
    )
  }

  const renderSelectedQnode = () => {
    return (
      <Grid item xs={12}>
        <QnodeInput
          selectedQnode={null}
          onSelectQnode={handleOnSelectQnode} />
      </Grid>
    )
  }

  const renderActionButtons = () => {
    return (
      <Grid item xs={12}>
        <Grid container spacing={3} justify="space-between">
          <Grid item>
            <Button
              autoFocus
              color="primary"
              variant="contained"
              onClick={handleOnSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <form noValidate autoComplete="off"
      className={classes.form}
      onSubmit={handleOnSubmit}>
      <Grid container spacing={3}>
        {renderCellContent()}
        {renderSelectedQnode()}
        {renderActionButtons()}
      </Grid>
    </form>
  )
}


export default WikificationMenu
