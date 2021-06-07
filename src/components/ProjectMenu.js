import React, { useState } from 'react'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import ProjectSettings from './ProjectSettings'


const ProjectMenu = () => {

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
        edge="end"
        color="inherit"
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
        anchorEl={anchorElement}
        onClose={hideProjectMenu}>
        <MenuItem onClick={openProjectSettings}>Settings</MenuItem>
      </Menu>
    )
  }

  const renderProjectSettings = () => {
    if ( showProjectSettings ) {
      return (
        <ProjectSettings
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
