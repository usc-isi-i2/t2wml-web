import React from 'react'

import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'

import TabPanel from './TabPanel'
import DraggablePaper from './DraggablePaper'
import AnnotationMenu from './AnnotationMenu'
import WikificationMenu from './WikificationMenu'
import * as utils from '../utils/table'


const useStyles = makeStyles(theme => ({
  overlayMenu: {
    position: 'absolute',
    top: theme.spacing(4),
    right: theme.spacing(15),
    '& > .MuiDialogTitle-root': {
      padding: 0,
    },
  },
}))


const OverlayMenu = ({
  file,
  sheet,
  selectedTab,
  setSelectedTab,
  selectedCell,
  selection,
  annotations,
  selectedAnnotation,
  suggestedAnnotation,
  onSelectionChange,
  updateAnnotation,
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
            annotations={annotations}
            selectedAnnotation={selectedAnnotation}
            suggestedAnnotation={suggestedAnnotation}
            onSelectionChange={onSelectionChange}
            updateAnnotation={updateAnnotation}
            hideOverlayMenu={hideOverlayMenu} />
        </TabPanel>
        <TabPanel value={selectedTab} index={'cell'}>
          <WikificationMenu
            selection={selection}
            selectedCell={selectedCell}
            selectedAnnotation={selectedAnnotation} />
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
      PaperComponent={DraggablePaper}
      PaperProps={{handle: '.draggable-overlay-handle'}}>
      <DialogTitle classes={{ root: 'draggable-overlay-handle' }}>
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
