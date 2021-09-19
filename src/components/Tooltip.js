import React from 'react'
import { Tooltip as MuiTooltip } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { withStyles } from '@material-ui/core/styles'

import { TOOLTIPS } from '../content/tooltips'


const StyledTooltip = withStyles({
  root: {
  },
})(MuiTooltip)


const Tooltip = ({ label }) => {

  return (
    <StyledTooltip arrow placement="right" title={TOOLTIPS[label]}>
      <HelpOutlineIcon fontSize="small" />
    </StyledTooltip>
  )
}


export default Tooltip
