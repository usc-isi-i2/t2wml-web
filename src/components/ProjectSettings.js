import React from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'

import DraggablePaper from './DraggablePaper'


const useStyles = makeStyles(theme => ({
  projectSettings: {
    position: 'absolute',
    top: theme.spacing(10),
    left: theme.spacing(5),
  },
}))


const ProjectSettings = ({
  hideProjectSettings,
}) => {

  const classes = useStyles()

  const renderTitle = () => {
    return (
      <React.Fragment>
        Project Settings
        <IconButton onClick={hideProjectSettings}>
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    )
  }

  const renderContent = () => {}

  const renderButtons = () => {}

  return (
    <Dialog
      open={true}
      onClose={hideProjectSettings}
      classes={{paper: classes.projectSettings}}
      aria-labelledby='dialog-modal-title'
      PaperComponent={DraggablePaper}
      PaperProps={{handle: '.draggable-project-settings-handle'}}>
      <DialogTitle classes={{ root: 'draggable-project-settings-handle' }}>
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


export default ProjectSettings
