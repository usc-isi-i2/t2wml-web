import React, { useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/styles'

import Draggable from 'react-draggable'

import AnnotationMenu from './AnnotationMenu'

import fetchSuggestions from '../utils/fetchSuggestions'
import * as utils from '../utils/table'


const useStyles = makeStyles(theme => ({
  menu: {
    position: 'absolute',
    top: theme.spacing(4),
    right: theme.spacing(15),
  },
}))


const OverlayMenu = ({
  file,
  sheet,
  isOpen,
  handleOnClose,
  selection,
  annotationBlocks,
  selectedAnnotationBlock,
  handleOnSelectionChange,
  hideAnnotationMenu,
}) => {

  const classes = useStyles()

  const [suggestions, setSuggestions] = useState({
    roles: [], types: [], children: {},
  })
  const [showAnnotationMenu, setShowAnnotationMenu] = useState(false)

  useEffect(() => {
    // user is opening the annotation menu with a selection
    if ( selection && showAnnotationMenu && !selectedAnnotationBlock ) {

      // call the annotation suggestion endpoint
      fetchSuggestions(file, sheet, selection, annotationBlocks)
      .then(data => setSuggestions(data))
      .catch(error => console.log(error))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAnnotationMenu])

  const openAnnotationMenu = () => {
    setShowAnnotationMenu(true)
  }

  const openWikifyMenu = () => {}

  const renderContent = () => {}

  const renderActions = () => {
    return (
      <Grid container justify="space-between">
        <Grid item xs={12}>
          <Button
            autoFocus
            color="primary"
            variant="link"
            onClick={openAnnotationMenu}>
            1. specify selection (subject/property/value)
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            color="primary"
            variant="link"
            onClick={openWikifyMenu}>
            2. link selection to wikidata knowledge base
          </Button>
        </Grid>
      </Grid>
    )
  }

  const renderOverlayMenu = () => {
    return (
      <Dialog
        open={isOpen}
        onClose={handleOnClose}
        classes={{ paper: classes.menu }}
        PaperProps={{ tabIndex: -1 }}
        TransitionComponent={Draggable}
        TransitionProps={{ handle: '.draggable-handle' }}>
        <DialogTitle classes={{ root: 'draggable-handle' }}>
          Selected {utils.humanReadableSelection(selection)}
          <IconButton aria-label="close" onClick={handleOnClose}>
            <CloseIcon />
          </IconButton>
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

  const renderAnnotationMenu = () => {
    return (
      <AnnotationMenu
        file={file}
        sheet={sheet}
        selection={selection}
        suggestions={suggestions}
        annotations={annotationBlocks}
        selectedAnnotation={selectedAnnotationBlock}
        onSelectionChange={handleOnSelectionChange}
        openMenu={showAnnotationMenu}
        hideMenu={hideAnnotationMenu} />
    )
  }

  const renderWikificationMenu = () => {}

  return (
    <React.Fragment>
      {renderOverlayMenu()}
      {renderAnnotationMenu()}
      {renderWikificationMenu()}
    </React.Fragment>
  )
}


export default OverlayMenu
