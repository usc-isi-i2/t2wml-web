import React, { useState } from 'react'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { makeStyles } from '@material-ui/core/styles'

import ProjectSettings from './ProjectSettings'


const useStyles = makeStyles(theme => ({
  icon: {
    marginLeft: -1 * theme.spacing(3),
  },
}))


const ProjectMenu = ({
  project,
  updateProject,
  guessAnnotations,
  uploadFidilFile,
}) => {

  const classes = useStyles()

  const [anchorElement, setAnchorElement] = useState()

  const [showProjectSettings, setShowProjectSettings] = useState(false)

  const openProjectSettings = () => {
    setShowProjectSettings(true)
    hideProjectMenu()
  }

  const hideProjectSettings = () => {
    setShowProjectSettings(false)
    hideProjectMenu()
  }

  const openProjectMenu = event => {
    setAnchorElement(event.target)
  }

  const hideProjectMenu = () => {
    setAnchorElement()
  }

  const renderButton = () => {
    return (
      <IconButton
        edge="start"
        color="inherit"
        className={classes.icon}
        onClick={openProjectMenu}>
        <MoreVertIcon />
      </IconButton>
    )
  }

  const renderMenu = () => {
    return (
      <Menu
        keepMounted
        id="project-menu"
        open={!!anchorElement}
        transformOrigin={{
          vertical: -50,
          horizontal: 0,
        }}
        anchorEl={anchorElement}
        onClose={hideProjectMenu}>
        <MenuItem onClick={openProjectSettings}>Settings</MenuItem>
        <MenuItem onClick={guessAnnotations}>Suggest Annotations</MenuItem>
        <MenuItem onClick={uploadFidilFile}>Upload FIDIL File</MenuItem>
      </Menu>
    )
  }

  const renderProjectSettings = () => {
    if ( showProjectSettings ) {
      return (
        <ProjectSettings
          project={project}
          updateProject={updateProject}
          hideProjectSettings={hideProjectSettings} />
      )
    }
  }

  return (
    <React.Fragment>
      {renderButton()}
      {renderMenu()}
      {renderProjectSettings()}
    </React.Fragment>
  )
}


export default ProjectMenu
