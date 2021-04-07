import { makeStyles } from '@material-ui/styles'


const useStyles = makeStyles(theme => ({
  dropzone: {
    display: 'flex',
    flexGrow: '1',
    height: '50vh',
    justifyContent: 'center',
    alignItems: 'center',
    outlineWidth: '0.5em',
    outlineStyle: 'dashed',
    outlineColor: theme.palette.type === 'dark' ? (
      'rgba(255, 255, 255, 0.25)'
    ) : (
      'rgba(0, 0, 0, 0.25)'
    ),
    outlineOffset: '-2em',
    cursor: 'pointer',
    transition: 'all 500ms ease',
    '&> svg': {
      opacity: '0.25',
      fill: theme.palette.type === 'dark' ? '#fff' : '#000',
      transition: 'all 500ms ease',
    },
    '&.active': {
      outlineColor: 'limegreen',
      outlineOffset: '-3em',
      outlineWidth: '0.6em',
    },
    '&.active > svg': {
      opacity: '0.75',
      fill: 'limegreen',
    },
  },
}))


export default useStyles
