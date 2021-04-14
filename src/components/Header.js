import React, { useState } from 'react'

import {
  AppBar,
  IconButton,
  Popover,
  Toolbar,
  Typography,
} from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home';
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'

import useStyles from '../styles/header'


const Header = props => {
  const classes = useStyles()

  const [anchorElement, setAnchorElement] = useState(null)

  const handlePopoverOpen = event => {
    setAnchorElement(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorElement(null)
  }

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
          className={classes.menuButton}>
          <HomeIcon onClick={refresh} />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          T2WML
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => props.switchTheme()}
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          aria-label="account of current user">
          {props.darkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Popover
          className="tooltip"
          open={!!anchorElement}
          anchorEl={anchorElement}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: -10,
            horizontal: 'center',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus>
          <Typography variant="body2">toggle light/dark theme</Typography>
        </Popover>
      </Toolbar>
    </AppBar>
  )
}


export default Header
