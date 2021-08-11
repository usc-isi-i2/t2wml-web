import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    userSelect: 'none',
  },
  guessAnnotations: {
    marginRight: theme.spacing(10),
    position: 'relative',
    '&.active': {
      marginRight: theme.spacing(10),
    },
    '& .MuiCircularProgress-root': {
      top: theme.spacing(1.25),
      right: -1 * theme.spacing(3),
      position: 'absolute',
      display: 'none',
    },
    '&.active .MuiCircularProgress-root': {
      display: 'block',
    },
  },
}))


export default useStyles
