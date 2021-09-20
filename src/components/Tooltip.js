import React from 'react'
import { Tooltip as MuiTooltip } from '@material-ui/core'
import InputAdornment from '@material-ui/core/InputAdornment'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { makeStyles } from '@material-ui/core/styles'

import { TOOLTIPS } from '../content/tooltips'
import classNames from '../utils/classNames'


const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'absolute',
    top: theme.spacing(3.5),
    right: theme.spacing(1),
    marginRight: theme.spacing(3),
  },
  tooltip: {
    verticalAlign: 'middle',
  },
  inline: {
    top: '50%',
    right: '1em',
    position: 'absolute',
    transform: 'translateY(-50%)',
  },
  topRight: {
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  icon: {
    cursor: 'pointer',
    marginLeft: theme.spacing(1),
  },
}))


const Tooltip = ({
  label,
  input = false,
  inline = false,
  topRight = false,
  placement = 'right',
}) => {

  const classes = useStyles()

  const renderTooltip = () => {
    return (
      <MuiTooltip
        arrow
        placement={placement}
        className={classNames(
          classes.tooltip, {
          inline,
          topRight,
        })}
        title={TOOLTIPS[label]}>
        <HelpOutlineIcon
          className={classes.icon}
          fontSize="small" />
      </MuiTooltip>
    )
  }

  const renderWrapper = () => {
    if ( input ) {
      return (
        <InputAdornment className={classes.wrapper}>
          {renderTooltip()}
        </InputAdornment>
      )
    }
    return renderTooltip()
  }


  return (
    <React.Fragment>
      {renderWrapper()}
    </React.Fragment>
  )
}


export default Tooltip
