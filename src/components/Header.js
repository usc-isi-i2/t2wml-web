import React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Tooltip from '@material-ui/core/Tooltip'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'

import ProjectMenu from './ProjectMenu'
import useStyles from '../styles/header'


const Header = ({
  project,
  darkTheme,
  switchTheme,
  toggleSettings,
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
    if ( !!project ) {
      return <ProjectMenu project={project} />
    }
  }

  const renderSpacer = () => {
    return (
      <div style={{ flexGrow: 1 }} />
    )
  }

  const renderThemeButton = () => {
    return (
      <Tooltip arrow title="toggle light/dark theme">
        <IconButton edge="end" color="inherit"
          onClick={() => switchTheme()}>
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
        {renderThemeButton()}
      </Toolbar>
    </AppBar>
  )
}


export default Header
