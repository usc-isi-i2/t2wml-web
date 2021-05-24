import React from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import QnodeInput from './QnodeInput'
import * as utils from '../utils/table'


const useStyles = makeStyles(theme => ({
  wrapper: {
    minHeight: '250px',
    marginTop: theme.spacing(1),
  },
}))


const WikificationMenu = ({
  hideMenu,
  selection,
  selectedCell,
  selectedAnnotation,
}) => {

  const classes = useStyles()

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
    if ( !selectedAnnotation ) { return }
    if ( !utils.isWikifyable(selectedAnnotation) ) { return }
    return (
      <Grid item xs={12}>
        <QnodeInput
          selectedQnode={null}
          onSelectQnode={handleOnSelectQnode} />
      </Grid>
    )
  }

  return (
    <Grid container spacing={3}
      className={classes.wrapper}>
      {renderCellContent()}
      {renderSelectedQnode()}
    </Grid>
  )
}


export default WikificationMenu
