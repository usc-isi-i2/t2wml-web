import { makeStyles } from '@material-ui/styles'


const useStyles = makeStyles(theme => ({
  menu: {
    position: 'absolute',
    top: theme.spacing(4),
    right: theme.spacing(15),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  additionalFieldsToggle: {
    '& > span': {
      cursor: 'pointer',
      userSelect: 'none',
      display: 'inline-block',
      verticalAlign: 'middle',
    },
  },
  deleteButton: {
    '&:hover': {
      color: 'red',
      transition: 'color 150ms ease',
    },
  },
}))


export default useStyles
