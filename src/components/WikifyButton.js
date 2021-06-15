import React from 'react'

import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import uploadWikinodes from '../utils/uploadWikinodes'


const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
    float: 'right',
  },
}))


const WikifyButton = ({
  file,
  sheet,
  selection,
  isProperty,
  dataType,
  setMessage,
}) => {

  const classes = useStyles()

  const handleOnClick = () => {
    uploadWikinodes(file, sheet, selection, isProperty, dataType)
    .then(data => console.log(data))
    .catch(error => {
      setMessage({
        type: 'error',
        title: `${error.errorCode} - ${error.errorTitle}`,
        text: error.errorDescription,
      })
    })

  }

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
