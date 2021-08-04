import React, { useState } from 'react'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles'

import ProjectSettings from './ProjectSettings'
import { DOWNLOAD_OPTIONS } from '../content/download-options'
import downloadFile from '../utils/downloadFile'


const useStyles = makeStyles(theme => ({
  icon: {
    marginLeft: -1 * theme.spacing(3),
  },
  menu: {
    '& ul.MuiMenu-list': {
      width: '250px',
      maxHeight: '325px',
      '& > li p.MuiTypography-root': {
        flex: '1 1 auto',
      },
      '& > li svg.MuiSvgIcon-root': {
        flex: '0 shrink',
      },
      '& .MuiCollapse-container li': {
        paddingLeft: theme.spacing(5),
      },
    },
  },
}))


const ProjectMenu = ({
  project,
  filename,
  sheetname,
  updateProject,
  guessAnnotations,
  showApplyAnnotations,
  uploadFidilFile,
}) => {

  const classes = useStyles()

  const [anchorElement, setAnchorElement] = useState()

  const [showProjectSettings, setShowProjectSettings] = useState(false)
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)

  const openProjectSettings = () => {
    setShowProjectSettings(true)
    hideProjectMenu()
  }

  const hideProjectSettings = () => {
    setShowProjectSettings(false)
    hideProjectMenu()
  }

  const suggestAnnotations = () => {
    guessAnnotations()
    hideProjectMenu()
  }

  const applyAnnotations = () => {
    showApplyAnnotations()
    hideProjectMenu()
  }

  const uploadFidil = () => {
    uploadFidilFile()
    hideProjectMenu()
  }

  const openProjectMenu = event => {
    setAnchorElement(event.target)
  }

  const hideProjectMenu = () => {
    setAnchorElement()
  }

  const toggleShowDownloadOptions = () => {
    setShowDownloadOptions(!showDownloadOptions)
  }

  const handleOnDownload = option => {
    downloadFile(project, filename, sheetname, option.value)
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
        className={classes.menu}
        anchorEl={anchorElement}
        onClose={hideProjectMenu}>
        <MenuItem onClick={openProjectSettings}>Settings</MenuItem>
        <MenuItem onClick={suggestAnnotations}>Suggest Annotations</MenuItem>
        <MenuItem onClick={applyAnnotations}>Apply Annotations</MenuItem>
        <MenuItem onClick={uploadFidil}>Upload FIDIL File</MenuItem>
        <Divider />
        <MenuItem onClick={toggleShowDownloadOptions}>
          <Typography>Download Options</Typography>
          {showDownloadOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </MenuItem>
        <Collapse in={showDownloadOptions} timeout="auto" unmountOnExit>
          {DOWNLOAD_OPTIONS.map(option => (
            <MenuItem onClick={() => handleOnDownload(option)}>
              {option.label}
            </MenuItem>
          ))}
        </Collapse>
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
