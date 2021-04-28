import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
  content: {
    width: '100vw',
    height: '100vh',
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 100%',
    height: '95vh',
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'row',
    top: 0,
    left: 0,
    right: 0,
  },
  inputWrapper: {
    flex: '0 0 auto',
    position: 'relative',
    overflow: 'scroll',
    width: '1150px',
    display: 'flex',
  },
  outputWrapper: {
    flex: '1 1 0%',
    position: 'relative',
    overflow: 'scroll',
    display: 'flex',
  },
}))


export default useStyles
