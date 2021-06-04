import React, { useState } from 'react'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'


const ProjectMenu = () => {

  const [anchorElement, setAnchorElement] = useState()

  const [showProjectSettings, setShowProjectSettings] = useState(false)
  const [showProjectTags, setShowProjectTags] = useState(false)

  const openProjectSettings = () => {
    setShowProjectSettings(true)
  }

  const hideProjectSettings = () => {
    setShowProjectSettings(false)
  }

  const openProjectTags = () => {
    setShowProjectTags(true)
  }

  const hideProjectTags = () => {
    setShowProjectTags(false)
  }

  const renderButton = () => {
    return (
      <IconButton
        edge="end"
        color="inherit"
        onClick={event => setAnchorElement(event.target)}>
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
        onClose={() => setAnchorElement()}>
        <MenuItem onClick={openProjectSettings}>Settings</MenuItem>
        <MenuItem onClick={openProjectTags}>Edit tags</MenuItem>
      </Menu>
    )
  }

  return (
    <React.Fragment>
      {renderButton()}
      {renderMenu()}
    </React.Fragment>
  )
}


export default ProjectMenu
