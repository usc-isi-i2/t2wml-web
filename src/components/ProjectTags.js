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
  projectTags: {
    position: 'absolute',
    top: theme.spacing(12),
    left: theme.spacing(8),
  },
}))


const ProjectTags = ({
  hideProjectTags,
}) => {

  const classes = useStyles()

  const renderTitle = () => {
    return (
      <React.Fragment>
        Project Tags
        <IconButton onClick={hideProjectTags}>
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
      onClose={hideProjectTags}
      classes={{paper: classes.projectTags}}
      aria-labelledby='dialog-modal-title'
      PaperComponent={DraggablePaper}
      PaperProps={{handle: '.draggable-project-tags-handle'}}>
      <DialogTitle classes={{ root: 'draggable-project-tags-handle' }}>
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


export default ProjectTags
