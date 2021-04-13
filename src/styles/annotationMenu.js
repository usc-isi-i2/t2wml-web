import { makeStyles } from '@material-ui/styles'


const useStyles = makeStyles(theme => ({
  menu: {
    position: 'absolute',
    top: theme.spacing(12),
    right: theme.spacing(5),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  deleteButton: {
    '&:hover': {
      color: 'red',
      transition: 'color 300ms ease',
    },
  },
}))


export default useStyles
