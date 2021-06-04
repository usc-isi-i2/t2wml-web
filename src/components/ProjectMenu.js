import React, { useState } from 'react'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'


const ProjectMenu = () => {

  const [anchorElement, setAnchorElement] = useState()

  return (
    <Menu
      keepMounted
      id="project-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorElement()}>
      <MenuItem onClick={handleClose}>Settings</MenuItem>
      <MenuItem onClick={handleClose}>Edit tags</MenuItem>
    </Menu>
  )
}


export default ProjectMenu
