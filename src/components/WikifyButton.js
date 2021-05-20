import React from 'react'

import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
    float: 'right',
  },
}))


const WikifyButton = () => {

  const classes = useStyles()

  const handleOnClick = () => {}

  return (
    <Button
      color="primary"
      variant="contained"
      className={classes.button}
      onClick={handleOnClick}>
      wikify this block automatically
    </Button>
  )
}


export default WikifyButton
