import React from 'react'

import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
    color: theme.palette.type === 'dark' ? '#99ddff' : '#006699',
    float: 'right',
  },
}))


const WikifyButton = () => {

  const classes = useStyles()

  const handleOnClick = () => {}

  return (
    <Link
      variant="body1"
      component="button"
      className={classes.button}
      onClick={handleOnClick}>
      wikify this block automatically
    </Link>
  )
}


export default WikifyButton
