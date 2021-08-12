import { makeStyles } from '@material-ui/styles'


const useStyles = makeStyles(theme => ({
  tableWrapper: {
    width: '100%',
    height: '100%',
    overflowX: 'scroll',
    overflowY: 'hidden',
    position: 'relative',
    '& .ReactVirtualized__Table': {
      tableLayout: 'fixed',
      transform:'rotateX(0deg)',
      borderCollapse: 'collapse',
      display: 'table',
      borderSpacing: '0',
      fontWeight: '400',
      userSelect: 'none',
      position: 'relative',
      cursor: 'crosshair',
      '&.active .ReactVirtualized__Grid .ReactVirtualized__Table__row .ReactVirtualized__Table__rowColumn>div': {
        opacity: '0.5',
      },
      '&.active .ReactVirtualized__Grid .ReactVirtualized__Table__row .ReactVirtualized__Table__rowColumn>.active': {
        opacity: '1',
      },
      '& .ReactVirtualized__Grid.ReactVirtualized__Table__Grid': {
        outline: 'none',
      },
      '& .ReactVirtualized__Table__headerColumn:nth-child(1)': {
        textAlign: 'center',
        background: theme.palette.type === 'dark' ? '#333' : '#f9f9f9',
        color: theme.palette.type === 'dark' ? '#fefefe' : '#777',
        minWidth: '50px',
        maxWidth: '50px',
        width: '50px',
        height: '25px',
        position: 'sticky',
        zIndex: '5',
        left: '-1px',
        top: '-1px',
        boxShadow: 'inset -1px 0px 0px 0px #c7c7c7',
        pointerEvents: 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: '7px',
          right: '3px',
          width: '0',
          height: '0',
          borderLeft: '20px solid transparent',
          borderRight: theme.palette.type === 'dark' ? (
            '20px solid #fefefe'
          ) : (
            '20px solid #ddd'
          ),
          borderTop: '20px solid transparent',
          pointerEvents: 'none',
        },
      },
      '& .ReactVirtualized__Table__headerColumn': {
        display: 'table-cell',
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
      '& .ReactVirtualized__Table__headerColumn::after': {
        content: '""',
        display: 'block',
        left: '0',
        right: '0',
        bottom: '5px',
        height: '1px',
        position: 'absolute',
        background: '#c7c7c7',
      },
      '& .ReactVirtualized__Table__headerColumn > div': {
        padding: '0.15em 0.5em',
        marginRight: '1px',
        width: '73px',
        minWidth: '73px',
        maxWidth: '73px',
        overflow: 'hidden',
        display: 'inline-block',
        //resize: 'horizontal',
        //cursor: 'col-resize',
      },
      '& .ReactVirtualized__Table__row': {
        display: 'table-row',
      },
      '& .ReactVirtualized__Table__row .ReactVirtualized__Table__rowColumn:nth-child(1)': {
        display: 'table-cell',
        textAlign: 'center',
        background: theme.palette.type === 'dark' ? '#333' : '#f9f9f9',
        color: theme.palette.type === 'dark' ? '#fefefe' : '#777',
        minWidth: '50px',
        maxWidth: '50px',
        width: '50px',
        height: '25px',
        position: 'sticky',
        left: '-1px',
        zIndex: '3',
        pointerEvents: 'none',
      },
      '& .ReactVirtualized__Table__row .ReactVirtualized__Table__rowColumn:nth-child(1) > div': {
        padding: '0.15em 0.5em',
      },
      '& .ReactVirtualized__Table__row .ReactVirtualized__Table__rowColumn:nth-child(1)::after': {
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
      '& .ReactVirtualized__Table__row .ReactVirtualized__Table__rowColumn': {
        display: 'table-cell',
        color: theme.palette.type === 'dark' ? '#ddd' : '#111',
        border: '1px solid #c7c7c7',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        position: 'relative',
        minWidth: '75px',
        maxWidth: '75px',
        height: '25px',
        width: '75px',
        zIndex: '1',
        '&>div': {
          padding: '0.15em 0.5em',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          '&.maxWidth': {
            background: '#efefef',
          },
        },
        '& .qnode': {
          color: theme.palette.type === 'dark' ? '#99ddff !important' : '#006699 !important',
        },
        '& .role-mainSubject': {
          background: theme.palette.type === 'dark' ? '#347898' : '#D9EAF2',
          color: theme.palette.type === 'dark' ? '#fefefe' : '#111',
          '&.highlight': {
            background: theme.palette.type === 'dark' ? '#54a1c5' : '#a0cbdf',
          },
          '&.wikified': {
            color: theme.palette.type === 'dark' ? '#99ddff' : '#006699',
          },
        },
        '& .role-dependentVar': {
          background: theme.palette.type === 'dark' ? '#3bab75' : '#D9F2E6',
          color: theme.palette.type === 'dark' ? '#fefefe' : '#111',
          '&.highlight': {
            background: theme.palette.type === 'dark' ? '#68cb9b' : '#a0dfc1',
          },
          '&.wikified': {
            color: theme.palette.type === 'dark' ? '#99ddff' : '#006699',
          },
        },
        '& .role-qualifier': {
          background: theme.palette.type === 'dark' ? '#3f3865' : '#DDD9F2',
          color: theme.palette.type === 'dark' ? '#fefefe' : '#111',
          '&.highlight': {
            background: theme.palette.type === 'dark' ? '#5e5396' : '#aaa0df',
          },
          '&.wikified': {
            color: theme.palette.type === 'dark' ? '#99ddff' : '#006699',
          },
        },
        '& .role-property': {
          background: theme.palette.type === 'dark' ? '#bb670f' : '#fbe5ce',
          color: theme.palette.type === 'dark' ? '#fefefe' : '#111',
          '&.highlight': {
            background: theme.palette.type === 'dark' ? '#ee8e29' : '#f5bf87',
          },
          '&.wikified': {
            color: theme.palette.type === 'dark' ? '#99ddff' : '#006699',
          },
        },
        '& .role-metadata': {
          background: theme.palette.type === 'dark' ? '#495e77' : '#d8dfe7',
          color: theme.palette.type === 'dark' ? '#fefefe' : '#111',
          '&.highlight': {
            background: theme.palette.type === 'dark' ? '#6984a3' : '#a9b8ca',
          },
          '&.wikified': {
            color: theme.palette.type === 'dark' ? '#99ddff' : '#006699',
          },
        },
        '& .role-unit': {
          background: theme.palette.type === 'dark' ? '#ce9700' : '#fff2ce',
          color: theme.palette.type === 'dark' ? '#fefefe' : '#111',
          '&.highlight': {
            background: theme.palette.type === 'dark' ? '#ffc21c' : '#ffde82',
          },
          '&.wikified': {
            color: theme.palette.type === 'dark' ? '#99ddff' : '#006699',
          },
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
        '& .active div.cell-border-top': {
          height: '2px',
        },
        '& .role-mainSubject div.cell-border-top': {
          background: theme.palette.type === 'dark' ? '#99ddff' : '#499bc1',
        },
        '& .role-dependentVar div.cell-border-top': {
          background: theme.palette.type === 'dark' ? '#D9F2E6' : '#3bab75',
        },
        '& .role-qualifier div.cell-border-top': {
          background: theme.palette.type === 'dark' ? '#8368b9' : '#8867cb',
        },
        '& .role-property div.cell-border-top': {
          background: theme.palette.type === 'dark' ? '#fbe5ce' : '#f1a655',
        },
        '& .role-metadata div.cell-border-top': {
          background: theme.palette.type === 'dark' ? '#d8dfe7' : '#556e8b',
        },
        '& .role-unit div.cell-border-top': {
          background: theme.palette.type === 'dark' ? '#fff2ce' : '#ffca38',
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
        '& .active div.cell-border-left': {
          width: '2px',
        },
        '& .role-mainSubject div.cell-border-left': {
          background: theme.palette.type === 'dark' ? '#99ddff' : '#499bc1',
        },
        '& .role-dependentVar div.cell-border-left': {
          background: theme.palette.type === 'dark' ? '#D9F2E6' : '#3bab75',
        },
        '& .role-qualifier div.cell-border-left': {
          background: theme.palette.type === 'dark' ? '#8368b9' : '#8867cb',
        },
        '& .role-property div.cell-border-left': {
          background: theme.palette.type === 'dark' ? '#fbe5ce' : '#f1a655',
        },
        '& .role-metadata div.cell-border-left': {
          background: theme.palette.type === 'dark' ? '#d8dfe7' : '#556e8b',
        },
        '& .role-unit div.cell-border-left': {
          background: theme.palette.type === 'dark' ? '#fff2ce' : '#ffca38',
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
        '& .active div.cell-border-right': {
          width: '2px',
        },
        '& .role-mainSubject div.cell-border-right': {
          background: theme.palette.type === 'dark' ? '#99ddff' : '#499bc1',
        },
        '& .role-dependentVar div.cell-border-right': {
          background: theme.palette.type === 'dark' ? '#D9F2E6' : '#3bab75',
        },
        '& .role-qualifier div.cell-border-right': {
          background: theme.palette.type === 'dark' ? '#8368b9' : '#8867cb',
        },
        '& .role-property div.cell-border-right': {
          background: theme.palette.type === 'dark' ? '#fbe5ce' : '#f1a655',
        },
        '& .role-metadata div.cell-border-right': {
          background: theme.palette.type === 'dark' ? '#d8dfe7' : '#556e8b',
        },
        '& .role-unit div.cell-border-right': {
          background: theme.palette.type === 'dark' ? '#fff2ce' : '#ffca38',
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
        '& .active div.cell-border-bottom': {
          height: '2px',
        },
        '& .role-mainSubject div.cell-border-bottom': {
          background: theme.palette.type === 'dark' ? '#99ddff' : '#499bc1',
        },
        '& .role-dependentVar div.cell-border-bottom': {
          background: theme.palette.type === 'dark' ? '#D9F2E6' : '#3bab75',
        },
        '& .role-qualifier div.cell-border-bottom': {
          background: theme.palette.type === 'dark' ? '#8368b9' : '#8867cb',
        },
        '& .role-property div.cell-border-bottom': {
          background: theme.palette.type === 'dark' ? '#fbe5ce' : '#f1a655',
        },
        '& .role-metadata div.cell-border-bottom': {
          background: theme.palette.type === 'dark' ? '#d8dfe7' : '#556e8b',
        },
        '& .role-unit div.cell-border-bottom': {
          background: theme.palette.type === 'dark' ? '#fff2ce' : '#ffca38',
        },
        '& div.cell-resize-corner': {
          display: 'block',
          position: 'absolute',
          right: '-1px',
          bottom: '-1px',
          width: '9px',
          height: '9px',
          cursor: 'pointer',
          background: theme.palette.type === 'dark' ? '#fefefe' : '#555',
          border: theme.palette.type === 'dark' ? '1px solid #555' : '1px solid #fefefe',
          zIndex: '25',
        },
        '& .role-mainSubject div.cell-resize-corner': {
          background: theme.palette.type === 'dark' ? '#99ddff' : '#499bc1',
        },
        '& .role-dependentVar div.cell-resize-corner': {
          background: theme.palette.type === 'dark' ? '#D9F2E6' : '#3bab75',
        },
        '& .role-qualifier div.cell-resize-corner': {
          background: theme.palette.type === 'dark' ? '#8368b9' : '#8867cb',
        },
        '& .role-property div.cell-resize-corner': {
          background: theme.palette.type === 'dark' ? '#fbe5ce' : '#f1a655',
        },
        '& .role-metadata div.cell-resize-corner': {
          background: theme.palette.type === 'dark' ? '#d8dfe7' : '#556e8b',
        },
        '& .role-unit div.cell-resize-corner': {
          background: theme.palette.type === 'dark' ? '#fff2ce' : '#ffca38',
        },
      },
    },
  },
}))


export default useStyles
