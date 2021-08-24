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
    top: '5vh',
    right: '10vw',
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
  targetSelection,
  selection,
  annotations,
  selectedAnnotation,
  suggestedAnnotation,
  submitNewAnnotation,
  onSelectionChange,
  updateAnnotations,
  updateTableDataLayers,
  updateOutputPreview,
  updateQnodeLayer,
  hideOverlayMenu,
  setMessage,
}) => {

  const classes = useStyles()

  const handleTabChange = (event, value) => {
    setSelectedTab(value)
  }

  const renderTitle = () => {
    const blockTabLabel = `Block ${utils.humanReadableSelection(selection)}`
    const cellTabLabel = `Cell ${utils.humanReadableSelection(targetSelection)}`
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
            selection={selection}
            annotations={annotations}
            selectedAnnotation={selectedAnnotation}
            suggestedAnnotation={suggestedAnnotation}
            submitNewAnnotation={submitNewAnnotation}
            updateTableDataLayers={updateTableDataLayers}
            updateOutputPreview={updateOutputPreview}
            onSelectionChange={onSelectionChange}
            updateAnnotations={updateAnnotations}
            hideOverlayMenu={hideOverlayMenu}
            setMessage={setMessage} />
        </TabPanel>
        <TabPanel value={selectedTab} index={'cell'}>
          <WikificationMenu
            file={file}
            sheet={sheet}
            selection={selection}
            setMessage={setMessage}
            selectedCell={selectedCell}
            targetSelection={targetSelection}
            updateQnodeLayer={updateQnodeLayer}
            selectedAnnotation={selectedAnnotation}
            updateOutputPreview={updateOutputPreview} />
        </TabPanel>
      </React.Fragment>
    )
  }

  const renderButtons = () => {}

  const renderOverlayMenu = () => {
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

  return (
    <React.Fragment>
      {renderOverlayMenu()}
    </React.Fragment>
  )
}


export default OverlayMenu
