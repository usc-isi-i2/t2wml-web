import React, { useState } from 'react'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'


const ProjectMenu = () => {

  const [anchorElement, setAnchorElement] = useState()

  const openSettings = () => {}

  const openTagsMenu = () => {}

  const renderButton = () => {
    return (
      <IconButton
        edge="end"
        color="inherit"
        onClick={event => setAnchorElement(event)}>
        <MoreVertIcon />
      </IconButton>
    )
  }

  const renderMenu = () => {
    return (
      <Menu
        keepMounted
        id="project-menu"
        anchorEl={anchorElement}
        open={Boolean(anchorElement)}
        onClose={() => setAnchorElement()}>
        <MenuItem onClick={() => openSettings()}>Settings</MenuItem>
        <MenuItem onClick={() => openTagsMenu()}>Edit tags</MenuItem>
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
