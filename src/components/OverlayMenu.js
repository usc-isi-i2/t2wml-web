import React, { useState } from 'react'

import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Paper from '@material-ui/core/Paper'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'

import Draggable from 'react-draggable'

import TabPanel from './TabPanel'
import AnnotationMenu from './AnnotationMenu'
import WikificationMenu from './WikificationMenu'
import * as utils from '../utils/table'


const useStyles = makeStyles(theme => ({
  overlayMenu: {
    position: 'absolute',
    top: theme.spacing(4),
    right: theme.spacing(15),
  },
}))


const OverlayMenu = ({
  file,
  sheet,
  selectedTab,
  setSelectedTab,
  selectedCell,
  selection,
  suggestions,
  annotations,
  selectedAnnotation,
  onSelectionChange,
  hideOverlayMenu,
}) => {

  const classes = useStyles()

  const handleTabChange = (event, value) => {
    setSelectedTab(value)
  }

  const renderTitle = () => {
    const blockTabLabel = `Block ${utils.humanReadableSelection(selection)}`
    const cellTabLabel = `Cell ${utils.humanReadableSelection(selectedCell)}`
    return (
      <React.Fragment>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary">
          <Tab label={blockTabLabel} value={'block'} />
          <Tab label={cellTabLabel} value={'cell'} />
        </Tabs>
        <IconButton onClick={hideOverlayMenu}>
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    )
  }

  const renderContent = () => {
    return (
      <React.Fragment>
        <TabPanel value={selectedTab} index={'block'}>
          <AnnotationMenu
            file={file}
            sheet={sheet}
            selectedCell={selectedCell}
            selection={selection}
            suggestions={suggestions}
            annotations={annotations}
            selectedAnnotation={selectedAnnotation}
            onSelectionChange={onSelectionChange}
            hideOverlayMenu={hideOverlayMenu} />
        </TabPanel>
        <TabPanel value={selectedTab} index={'cell'}>
          <WikificationMenu
            selection={selection}
            selectedCell={selectedCell} />
        </TabPanel>
      </React.Fragment>
    )
  }

  const renderButtons = () => {}

  return (
    <Dialog
      open={true}
      onClose={hideOverlayMenu}
      classes={{paper: classes.overlayMenu}}
      aria-labelledby='dialog-modal-title'
      PaperComponent={props => (
        <Draggable handle='.draggable-handle'>
          <Paper {...props} />
        </Draggable>
      )}>
      <DialogTitle classes={{ root: 'draggable-handle' }}>
        {renderTitle()}
      </DialogTitle>
      <DialogContent>
        {renderContent()}
      </DialogContent>
      <DialogActions>
        {renderButtons()}
      </DialogActions>
    </Dialog>
  )
}


export default OverlayMenu
