import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
  icon: {
    marginLeft: -1 * theme.spacing(3),
  },
  menu: {
    '& ul.MuiMenu-list': {
      width: '300px',
      maxHeight: '325px',
      '& li p.MuiTypography-root': {
        flex: '1 1 auto',
      },
      '& > li svg.MuiSvgIcon-root': {
        flex: '0 shrink',
      },
      '& .MuiCollapse-container li': {
        paddingLeft: theme.spacing(5),
      },
    },
  },
}))


export default useStyles
