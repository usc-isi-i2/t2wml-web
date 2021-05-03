import React, { useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/styles'

import Draggable from 'react-draggable'

import * as utils from '../utils/table'


const useStyles = makeStyles(theme => ({
  menu: {
    position: 'absolute',
    top: theme.spacing(12),
    right: theme.spacing(5),
  },
}))


const WikificationMenu = ({
  hideMenu,
  selection,
  selectedCell,
}) => {

  const classes = useStyles()

  const renderTitle = () => {
    return (
      <React.Fragment>
        {`Wikify this ${utils.isBlock(selection) ? 'block' : 'cell'}`}
        <IconButton aria-label="close" onClick={hideMenu}>
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    )
  }

  const renderFormInstructions = () => {
    return (
      <Grid item xs={12}>
        <FormHelperText component="p">
          Use this form to connect the value(s) to items in wikidata
        </FormHelperText>
      </Grid>
    )
  }

  const renderQnodeSearch = () => {
    return (
      <Grid item xs={12}>
        <TextField
          fullWidth
          variant="outlined"
          label={'Search wikidata'}
          id={'wikidata-search'}
          name={'wikidata-search'}
          onChange={handleOnChange} />
      </Grid>
    )
  }

  const renderContent = () => {
    return (
      <Grid container spacing={3}>
        {renderFormInstructions()}
        <p style={{paddingLeft: '12px'}}>value: {selectedCell}</p>
        {renderQnodeSearch()}
      </Grid>
    )
  }

  const renderActions = () => {}

  return (
    <Dialog
      open={true}
      onClose={hideMenu}
      classes={{ paper: classes.menu }}
      PaperProps={{ tabIndex: -1 }}
      TransitionComponent={Draggable}
      TransitionProps={{ handle: '.draggable-handle' }}>
      <DialogTitle classes={{ root: 'draggable-handle' }}>
        {renderTitle()}
      </DialogTitle>
      <DialogContent>
        {renderContent()}
      </DialogContent>
      <DialogActions>
        {renderActions()}
      </DialogActions>
    </Dialog>
  )
}


export default WikificationMenu
