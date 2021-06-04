import React, { useState } from 'react'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import ProjectSettings from './ProjectSettings'
import ProjectTags from './ProjectTags'


const ProjectMenu = ({ tags, setTags }) => {

  const [anchorElement, setAnchorElement] = useState()

  const [showProjectSettings, setShowProjectSettings] = useState(false)
  const [showProjectTags, setShowProjectTags] = useState(false)

  const openProjectSettings = () => {
    setShowProjectSettings(true)
    hideProjectMenu()
  }

  const hideProjectSettings = () => {
    setShowProjectSettings(false)
    hideProjectMenu()
  }

  const openProjectTags = () => {
    setShowProjectTags(true)
    hideProjectMenu()
  }

  const hideProjectTags = () => {
    setShowProjectTags(false)
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
        <MenuItem onClick={openProjectTags}>Edit tags</MenuItem>
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

  const renderProjectTags = () => {
    if ( showProjectTags ) {
      return (
        <ProjectTags
          tags={tags}
          setTags={setTags}
          hideProjectTags={hideProjectTags} />
      )
    }
  }

  return (
    <React.Fragment>
      {renderButton()}
      {renderMenu()}
      {renderProjectSettings()}
      {renderProjectTags()}
    </React.Fragment>
  )
}


export default ProjectMenu
