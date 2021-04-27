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
          background: '#eee',
        },
        '&.role-mainSubject': {
          background: '#D9EAF2',
          color: '#006699',
        },
        '&.role-dependentVar': {
          background:'#D9F2E6',
          color: '#111',
        },
        '&.role-qualifier': {
          background:'#DDD9F2',
          color: '#111',
        },
        '&.role-property': {
          background: '#fbe5ce',
          color: '#111',
        },
        '&.role-metadata': {
          background: '#d8dfe7',
          color: '#111',
        },
        '&.role-unit': {
          background: '#fff2ce',
          color: '#111',
        },
        '& div.cell-border-top': {
          display: 'block',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '1px',
          pointerEvents: 'none',
          background: theme.palette.type === 'dark' ? '#fefefe' : '#555',
          zIndex: '5',
        },
        '&.active div.cell-border-top': {
          height: '2px',
        },
        '&.role-mainSubject div.cell-border-top': {
          background:'#499bc1',
        },
        '&.role-dependentVar div.cell-border-top': {
          background:'#3bab75',
        },
        '&.role-qualifier div.cell-border-top': {
          background:'#8867cb',
        },
        '&.role-property div.cell-border-top': {
          background:'#f1a655',
        },
        '&.role-metadata div.cell-border-top': {
          background:'#556e8b',
        },
        '&.role-unit div.cell-border-top': {
          background:'#ffca38',
        },
        '& div.cell-border-left': {
          display: 'block',
          position: 'absolute',
          top: '0',
          left: '0',
          bottom: '0',
          width: '1px',
          pointerEvents: 'none',
          background: theme.palette.type === 'dark' ? '#fefefe' : '#555',
          zIndex: '5',
        },
        '&.active div.cell-border-left': {
          width: '2px',
        },
        '&.role-mainSubject div.cell-border-left': {
          background:'#499bc1',
        },
        '&.role-dependentVar div.cell-border-left': {
          background:'#3bab75',
        },
        '&.role-qualifier div.cell-border-left': {
          background:'#8867cb',
        },
        '&.role-property div.cell-border-left': {
          background:'#f1a655',
        },
        '&.role-metadata div.cell-border-left': {
          background:'#556e8b',
        },
        '&.role-unit div.cell-border-left': {
          background:'#ffca38',
        },
        '& div.cell-border-right': {
          display: 'block',
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          width: '1px',
          pointerEvents: 'none',
          background: theme.palette.type === 'dark' ? '#fefefe' : '#555',
          zIndex: '5',
        },
        '&.active div.cell-border-right': {
          width: '2px',
        },
        '&.role-mainSubject div.cell-border-right': {
          background:'#499bc1',
        },
        '&.role-dependentVar div.cell-border-right': {
          background:'#3bab75',
        },
        '&.role-qualifier div.cell-border-right': {
          background:'#8867cb',
        },
        '&.role-property div.cell-border-right': {
          background:'#f1a655',
        },
        '&.role-metadata div.cell-border-right': {
          background:'#556e8b',
        },
        '&.role-unit div.cell-border-right': {
          background:'#ffca38',
        },
        '& div.cell-border-bottom': {
          display: 'block',
          position: 'absolute',
          left: '0',
          right: '0',
          bottom: '0',
          height: '1px',
          pointerEvents: 'none',
          background: theme.palette.type === 'dark' ? '#fefefe' : '#555',
          zIndex: '5',
        },
        '&.active div.cell-border-bottom': {
          height: '2px',
        },
        '&.role-mainSubject div.cell-border-bottom': {
          background:'#499bc1',
        },
        '&.role-dependentVar div.cell-border-bottom': {
          background:'#3bab75',
        },
        '&.role-qualifier div.cell-border-bottom': {
          background:'#8867cb',
        },
        '&.role-property div.cell-border-bottom': {
          background:'#f1a655',
        },
        '&.role-metadata div.cell-border-bottom': {
          background:'#556e8b',
        },
        '&.role-unit div.cell-border-bottom': {
          background:'#ffca38',
        },
        '& div.cell-resize-corner': {
          display: 'block',
          position: 'absolute',
          right: '-2px',
          bottom: '-2px',
          width: '9px',
          height: '9px',
          cursor: 'pointer',
          background: theme.palette.type === 'dark' ? '#fefefe' : '#555',
          border: theme.palette.type === 'dark' ? '1px solid #555' : '1px solid #fefefe',
          zIndex: '25',
        },
        '&.role-mainSubject div.cell-resize-corner': {
          background:'#499bc1',
        },
        '&.role-dependentVar div.cell-resize-corner': {
          background:'#3bab75',
        },
        '&.role-qualifier div.cell-resize-corner': {
          background:'#8867cb',
        },
        '&.role-property div.cell-resize-corner': {
          background:'#f1a655',
        },
        '&.role-metadata div.cell-resize-corner': {
          background:'#556e8b',
        },
        '&.role-unit div.cell-resize-corner': {
          background:'#ffca38',
        },
      },
      '&.active tr td': {
        opacity: '0.5',
        '&.active': {
           opacity: '1',
        },
      },
    },
  },
}))


export default useStyles
