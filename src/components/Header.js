import React from 'react'

import {
  AppBar,
  IconButton,
  Tooltip,
  Toolbar,
  Typography,
} from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'

import useStyles from '../styles/header'


const Header = ({filename, darkTheme, switchTheme, toggleSettings}) => {

  const classes = useStyles()

  const refresh = () => {
    window.location.reload()
  }

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={refresh}
          className={classes.menuButton}>
          <HomeIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {filename ? filename : 'T2WML'}
        </Typography>
        <IconButton edge="end" color="inherit">
          <MoreVertIcon />
        </IconButton>
        <div style={{ flexGrow: 1 }} />
        <Tooltip arrow title="toggle light/dark theme">
          <IconButton edge="end" color="inherit"
            onClick={() => switchTheme()}>
            {darkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}


export default Header
