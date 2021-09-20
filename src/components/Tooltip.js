import React from 'react'
import { Tooltip as MuiTooltip } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { makeStyles } from '@material-ui/core/styles'

import { TOOLTIPS } from '../content/tooltips'
import classNames from '../utils/classNames'


const useStyles = makeStyles(theme => ({
  tooltip: {
    verticalAlign: 'middle',
  },
  inline: {
    top: '50%',
    right: '1em',
    position: 'absolute',
    transform: 'translateY(-50%)',
  },
  icon: {
    cursor: 'pointer',
    marginLeft: '0.5em',
  },
}))


const Tooltip = ({ label, inline = 'false', placement = 'right' }) => {

  const classes = useStyles()

  return (
    <MuiTooltip
      arrow
      placement={placement}
      className={classNames(
        classes.tooltip, {
        inline,
      })}
      title={TOOLTIPS[label]}>
      <HelpOutlineIcon
        className={classes.icon}
        fontSize="small" />
    </MuiTooltip>
  )
}


export default Tooltip
