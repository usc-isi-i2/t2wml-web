import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    userSelect: 'none',
  },
  tooltip: {
    pointerEvents: 'none',
    userSelect: 'none',
  },
}))


export default useStyles
