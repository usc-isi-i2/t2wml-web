import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
  content: {
    width: '100vw',
    height: '100vh',
    overflow: 'auto',
    background: theme.palette.type === 'dark' ?
      'linear-gradient(180deg, #4D4D4D, #737373)' :
      'linear-gradient(180deg, #d8d8d8, #fefefe)',
  },
  wrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 'calc(100vh - 48px)',
    overflow: 'hidden',
    position: 'relative',
  },
  inputWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '50vw',
    float: 'left',
    overflowX: 'auto',
    overflowY: 'hidden',
  },
  divider: {
    width: '10px',
    top: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    cursor: 'col-resize',
    backgroundColor: 'black',
  },
  outputWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: '50vw',
  },
}))


export default useStyles
