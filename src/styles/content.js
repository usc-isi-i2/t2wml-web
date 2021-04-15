import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
  content: {
    width: '100vw',
    height: '100vh',
  },
  divider: {
    width: '5px',
    height: '100vh',
    marginRight: '-5px',
    cursor: 'ew-resize',
    background: '#c7c7c7',
    zIndex: '5',
  },
}))


export default useStyles
