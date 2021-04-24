import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
  content: {
    width: '100vw',
    height: '100vh',
  },
  inputWrapper: {
    position: 'absolute',
    top: theme.spacing(6),
    left: 0,
    right: 0,
    bottom: 0,
    height: '95vh',
  },
  outputWrapper: {
    position: 'absolute',
    top: theme.spacing(6),
    left: '65vw',
    right: 0,
    bottom: 0,
    height: '95vh',
  },
}))


export default useStyles
