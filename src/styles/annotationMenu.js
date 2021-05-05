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
  deleteButton: {
    '&:hover': {
      color: 'red',
      transition: 'color 150ms ease',
    },
  },
  properties: {
    paddingInlineStart: theme.spacing(2),
    marginBlockStart: 0,
    '&> li': {
      paddingBottom: theme.spacing(1),
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
}))


export default useStyles
