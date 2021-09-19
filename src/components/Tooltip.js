import React from 'react'
import { Tooltip as MuiTooltip } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { makeStyles } from '@material-ui/core/styles'

import { TOOLTIPS } from '../content/tooltips'


const useStyles = makeStyles(theme => ({
  tooltip: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: '1em',
  },
  icon: {
    cursor: 'pointer',
  },
}))


const Tooltip = ({ label }) => {

  const classes = useStyles()

  return (
    <MuiTooltip
      arrow
      placement="right"
      className={classes.tooltip}
      title={TOOLTIPS[label]}>
      <HelpOutlineIcon
        className={classes.icon}
        fontSize="small" />
    </MuiTooltip>
  )
}


export default Tooltip
