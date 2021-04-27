import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
  tableWrapper: {
    width: '100%',
    height: '95vh',
    overflow: 'scroll',
    position: 'relative',
    '& table': {
      tableLayout: 'fixed',
      transform:'rotateX(0deg)',
      border: '1px solid #c7c7c7',
      borderCollapse: 'collapse',
      borderSpacing: '0',
      fontWeight: '400',
      userSelect: 'none',
      position: 'relative',
      cursor: 'crosshair',
      '& th:nth-child(1)': {
        padding: '0.15em 0.5em',
        textAlign: 'center',
        background: theme.palette.type === 'dark' ? '#333' : '#f9f9f9',
        color: theme.palette.type === 'dark' ? '#fefefe' : '#777',
        minWidth: '3em',
        maxWidth: '3em',
        width: '3em',
        position: 'sticky',
        zIndex: '5',
        left: '-1px',
        top: '-1px',
        boxShadow: 'inset -1px 0px 0px 0px #c7c7c7',
        pointerEvents: 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: '2px',
          right: '2px',
          width: '0',
          height: '0',
          borderLeft: '1.25em solid transparent',
          borderRight: theme.palette.type === 'dark' ? (
            '1.25em solid #fefefe'
          ) : (
            '1.25em solid #ddd'
          ),
          borderTop: '1.25em solid transparent',
          pointerEvents: 'none',
        },
      },
      '& thead tr th': {
        border: '1px solid #c7c7c7',
        whiteSpace: 'nowrap',
        minWidth: '75px',
        textAlign: 'center',
        background: theme.palette.type === 'dark' ? '#333' : '#f9f9f9',
        color: theme.palette.type === 'dark' ? '#fefefe' : '#777',
        position: 'sticky',
        zIndex: '3',
        width: '75px',
        top: '-1px',
      },
      '& thead tr th::after': {
        content: '""',
        display: 'block',
        left: '0',
        right: '0',
        bottom: '0',
        height: '1px',
        position: 'absolute',
        background: '#c7c7c7',
      },
      '& thead tr th > div': {
        padding: '0.15em 0.5em',
        marginRight: '1px',
        width: '75px',
        minWidth: '75px',
        height: '1.25em',
        overflow: 'hidden',
        resize: 'horizontal',
        display: 'inline-block',
        cursor: 'col-resize',
      },
      '& tr td:nth-child(1)': {
        textAlign: 'center',
        background: theme.palette.type === 'dark' ? '#333' : '#f9f9f9',
        color: theme.palette.type === 'dark' ? '#fefefe' : '#777',
        padding: '0.15em 0.5em',
        minWidth: '3em',
        maxWidth: '3em',
        width: '3em',
        position: 'sticky',
        zIndex: '3',
        left: '-1px',
        pointerEvents: 'none',
      },
      '& tr td:nth-child(1)::after': {
        content: '""',
        display: 'block',
        top: '0',
        right: '0',
        bottom: '0',
        width: '1px',
        position: 'absolute',
        background: '#c7c7c7',
        pointerEvents: 'none',
      },
      '& tr td': {
        color: theme.palette.type === 'dark' ? '#ddd' : '#111',
        border: '1px solid #c7c7c7',
        padding: '0.15em 0.5em',
        lineHeight: '1.25em',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        position: 'relative',
        minWidth: '75px',
        maxWidth: '75px',
        width: '75px',
        zIndex: '1',
        '&.active': {
          animationName: 'blink',
          animationDuration: '10s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
          background: 'repeating-linear-gradient(-45deg, #fff, #fff 25%, #eee 25%, #eee 50%, #fff 50%) top left fixed',
          backgroundSize: '30px 30px',
          '&.subject': {
            background: theme.palette.type === 'dark' ? 'repeating-linear-gradient(-45deg, #4d4d4d, #4d4d4d 25%, #347898 25%, #347898 50%, #4d4d4d 50%) top left fixed' : 'repeating-linear-gradient(-45deg, #fff, #fff 25%, #D9EAF2 25%, #D9EAF2 50%, #fff 50%) top left fixed',
            backgroundSize: '30px 30px',
          },
          '&.property': {
            background: theme.palette.type === 'dark' ? 'repeating-linear-gradient(-45deg, #4d4d4d, #4d4d4d 25%, #bb670f 25%, #bb670f 50%, #4d4d4d 50%) top left fixed' : 'repeating-linear-gradient(-45deg, #fff, #fff 25%, #fbe5ce 25%, #fbe5ce 50%, #fff 50%) top left fixed',
            backgroundSize: '30px 30px',
          },
          '&.value': {
            background: theme.palette.type === 'dark' ? 'repeating-linear-gradient(-45deg, #4d4d4d, #4d4d4d 25%, #3bab75 25%, #3bab75 50%, #4d4d4d 50%) top left fixed' : 'repeating-linear-gradient(-45deg, #fff, #fff 25%, #D9F2E6 25%, #D9F2E6 50%, #fff 50%) top left fixed',
            backgroundSize: '30px 30px',
          },
          '&.unit': {
            background: theme.palette.type === 'dark' ? 'repeating-linear-gradient(-45deg, #4d4d4d, #4d4d4d 25%, #fff2ce 25%, #fff2ce 50%, #4d4d4d 50%) top left fixed' : 'repeating-linear-gradient(-45deg, #fff, #fff 25%, #fff2ce 25%, #fff2ce 50%, #fff 50%) top left fixed',
            backgroundSize: '30px 30px',
          },
        },
      },
    },
  },
}))


export default useStyles
