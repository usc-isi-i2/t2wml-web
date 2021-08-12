import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
  content: {
    width: '100vw',
    height: '100vh',
    background: theme.palette.type === 'dark' ?
      'linear-gradient(180deg, #4D4D4D, #737373)' :
      'linear-gradient(180deg, #d8d8d8, #fefefe)',
  },
  wrapper: {
    //display: 'flex',
    //flex: '1 1 100%',
    //height: '95vh',
    //position: 'relative',
    //overflow: 'hidden',
    //flexDirection: 'row',
    //top: 0,
    //left: 0,
    //right: 0,

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '95vh',
    overflow: 'hidden',
    position: 'relative',
  },
  inputWrapper: {
    //flex: '0 0 auto',
    //position: 'relative',
    //overflowX: 'scroll',
    //overflowY: 'hidden',
    //width: '1150px',
    //display: 'flex',

    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '50vw',
    float: 'left',
    overflowY: 'hidden',
  },
  divider: {
    height: '100%',
    width: '10px',
    float: 'right',
    cursor: 'col-resize',
    backgroundColor: 'black',
  },
  outputWrapper: {
    //flex: '1 1 0%',
    //position: 'relative',
    //overflow: 'scroll',
    //display: 'flex',
    //

    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: '50vw',
  },
}))


export default useStyles
