import { makeStyles } from '@material-ui/styles'


const useStyles = makeStyles(theme => ({
  wrapper: {
    minHeight: '250px',
    marginTop: theme.spacing(1),
  },
  form: {
    width: '100%',
    minHeight: '250px',
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
  help: {
    cursor: 'pointer',
  },
  tooltip: {
    marginRight: theme.spacing(3),
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: theme.spacing(1),
  },
}))


export default useStyles
