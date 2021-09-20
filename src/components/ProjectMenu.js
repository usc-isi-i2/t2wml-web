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
import CircularProgress from '@material-ui/core/CircularProgress'

import Tooltip from './Tooltip'
import ProjectSettings from './ProjectSettings'
import { DOWNLOAD_OPTIONS } from '../content/download-options'
import downloadFile from '../utils/downloadFile'
import useStyles from '../styles/projectMenu'


const ProjectMenu = ({
  project,
  filename,
  sheetname,
  setMessage,
  updateProject,
  guessAnnotations,
  loadingAnnotations,
  showApplyAnnotations,
  showDownloadOptions,
  uploadFidilFile,
}) => {

  const classes = useStyles()

  const [anchorElement, setAnchorElement] = useState()

  const [showProjectSettings, setShowProjectSettings] = useState(false)
  const [expandDownloadOptions, setExpandDownloadOptions] = useState(false)

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

  const toggleExpandDownloadOptions = () => {
    setExpandDownloadOptions(!expandDownloadOptions)
  }

  const handleOnDownload = option => {
    downloadFile(project, filename, sheetname, option.value, option.url)
    hideProjectMenu()
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
        <MenuItem onClick={openProjectSettings}>
          <Typography>Project Settings</Typography>
          <Tooltip label={'project_settings'} inline={true} />
        </MenuItem>
        <MenuItem onClick={suggestAnnotations} disabled={loadingAnnotations}>
          <Typography>Suggest Annotations</Typography>
          <Tooltip label={'suggest_annotations'} inline={true} />
          {loadingAnnotations ? (
            <CircularProgress color="inherit" size={16} />
          ) : null}
        </MenuItem>
        <MenuItem onClick={applyAnnotations}>
          <Typography>Apply Annotations</Typography>
          <Tooltip label={'apply_annotations'} inline={true} />
        </MenuItem>
        {showDownloadOptions && (
          <React.Fragment>
            <MenuItem onClick={uploadFidil}>
              <Typography>Upload FIDIL File</Typography>
              <Tooltip label={'upload_fidil'} inline={true} />
            </MenuItem>
            <Divider />
            <MenuItem onClick={toggleExpandDownloadOptions}>
              <Typography>Download Options</Typography>
              {expandDownloadOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </MenuItem>
            <Collapse in={expandDownloadOptions} timeout="auto" unmountOnExit>
              {DOWNLOAD_OPTIONS.map(option => (
                <MenuItem key={option.label}
                  onClick={() => handleOnDownload(option)}>
                  <Typography>{option.label}</Typography>
                  <Tooltip label={`download_${option.value}`} inline={true} />
                </MenuItem>
              ))}
            </Collapse>
          </React.Fragment>
        )}
      </Menu>
    )
  }

  const renderProjectSettings = () => {
    if ( showProjectSettings ) {
      return (
        <ProjectSettings
          project={project}
          setMessage={setMessage}
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
