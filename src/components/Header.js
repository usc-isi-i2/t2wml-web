import React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

import ViewQuiltIcon from '@material-ui/icons/ViewQuilt'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'

import ProjectMenu from './ProjectMenu'
import useStyles from '../styles/header'


const Header = ({
  project,
  setProject,
  darkTheme,
  switchTheme,
  toggleSettings,
  guessAnnotations,
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
        setProject={setProject}
        guessAnnotations={guessAnnotations} />
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
      <Tooltip arrow title="guess annotations">
        <Button
          color="secondary"
          startIcon={<ViewQuiltIcon />}
          onClick={guessAnnotations}>
          Suggest Annotations
        </Button>
      </Tooltip>
    )
  }

  const renderThemeButton = () => {
    return (
      <Tooltip arrow title="toggle light/dark theme">
        <IconButton edge="end" color="inherit"
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
