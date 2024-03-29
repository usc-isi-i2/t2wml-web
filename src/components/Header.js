import React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'

import ViewQuiltIcon from '@material-ui/icons/ViewQuilt'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'

import ProjectMenu from './ProjectMenu'
import { TOOLTIPS } from '../content/tooltips'
import classNames from '../utils/classNames'
import useStyles from '../styles/header'


const Header = ({
  darkTheme,
  setMessage,
  project,
  filename,
  sheetname,
  updateProject,
  switchTheme,
  toggleSettings,
  guessAnnotations,
  loadingAnnotations,
  showApplyAnnotations,
  showDownloadOptions,
  uploadFidilFile,
}) => {

  const classes = useStyles()

  const renderProjectInfo = () => {
    return (
      <Typography variant="h6" className={classes.title}>
        {project ? project.title : 'T2WML'}
      </Typography>
    )
  }

  const renderProjectMenu = () => {
    if ( !project ) { return }
    return (
      <ProjectMenu
        project={project}
        filename={filename}
        sheetname={sheetname}
        setMessage={setMessage}
        updateProject={updateProject}
        guessAnnotations={guessAnnotations}
        loadingAnnotations={loadingAnnotations}
        showApplyAnnotations={showApplyAnnotations}
        showDownloadOptions={showDownloadOptions}
        uploadFidilFile={uploadFidilFile} />
    )
  }

  const renderSpacer = () => {
    return (
      <div style={{ flexGrow: 1 }} />
    )
  }

  const renderSuggestButton = () => {
    if ( !project ) { return }
    return (
      <Tooltip arrow title={TOOLTIPS['suggest_annotations']}>
        <Button
          color="secondary"
          startIcon={<ViewQuiltIcon />}
          endIcon={<CircularProgress color="inherit" size={16} />}
          className={classNames(classes.guessAnnotations, {
            active: loadingAnnotations,
          })}
          disabled={loadingAnnotations}
          onClick={guessAnnotations}>
          Suggest Annotations
        </Button>
      </Tooltip>
    )
  }

  const renderThemeButton = () => {
    return (
      <Tooltip arrow title="toggle light/dark theme">
        <IconButton edge="end" color="inherit" tabIndex="-1"
          onClick={switchTheme}>
          {darkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Tooltip>
    )
  }

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        {renderProjectMenu()}
        {renderProjectInfo()}
        {renderSpacer()}
        {renderSuggestButton()}
        {renderThemeButton()}
      </Toolbar>
    </AppBar>
  )
}


export default Header
