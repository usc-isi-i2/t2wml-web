import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
  wrapper: {
    width: '100%',
    height: '95vh',
    overflow: 'scroll',
    position: 'relative',
    padding: theme.spacing(2),
  },
}))


export default useStyles
