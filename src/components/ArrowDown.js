import React from 'react'
import Fab from '@material-ui/core/Fab'
import Slide from '@material-ui/core/Slide'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { makeStyles } from '@material-ui/styles'


const useStyles = makeStyles(theme => ({
  button: {
    position: 'absolute',
    left: theme.spacing(7),
    bottom: theme.spacing(3),
    cursor: 'pointer',
    zIndex: 100,
    '& svg': {
      marginRight: theme.spacing(1),
    },
  },
}))


const ArrowDown = ({ handleOnClick }) => {

  const classes = useStyles()

  return (
    <Slide
      in={true}
      direction="up"
      mountOnEnter
      unmountOnExit>
      <Fab variant="extended"
        onClick={handleOnClick}
        className={classes.button}>
        <ArrowDownwardIcon fontSize="default" />
        Scroll To Bottom
      </Fab>
    </Slide>
  )
}


export default ArrowDown
