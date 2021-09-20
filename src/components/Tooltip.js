import React from 'react'
import { Tooltip as MuiTooltip } from '@material-ui/core'
import InputAdornment from '@material-ui/core/InputAdornment'
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
  topRight: {
    top: '1em',
    right: '1em',
  },
  icon: {
    cursor: 'pointer',
    marginLeft: '0.5em',
  },
}))


const Tooltip = ({
  label,
  input = 'false',
  inline = 'false',
  topRight = 'false',
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
        <InputAdornment>
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
