import React from 'react'
import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'



const useStyles = makeStyles((theme) => ({
  tableWrapper: {
    position: 'relative',
    overflow: 'scroll',
    height: '100vh',
    '& table': {
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
        minWidth: '1em',
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
        width: '75px',
        minWidth: '75px',
        height: '1.25em',
        resize: 'horizontal',
        overflow: 'hidden',
        display: 'inline-table',
      },
      '& tr td:nth-child(1)': {
        textAlign: 'center',
        background: theme.palette.type === 'dark' ? '#333' : '#f9f9f9',
        color: theme.palette.type === 'dark' ? '#fefefe' : '#777',
        padding: '0.15em 0.5em',
        minWidth: '1em',
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
        color: theme.palette.type === 'dark' ? '#fefefe' : '#777',
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
      },
    },
  },
}))


const Table = ({
  onMouseUp,
  onMouseDown,
  onMouseMove,
  setTableReference,
}) => {

  const classes = useStyles()

  const MIN_NUM_ROWS = 100;
  const CHARACTERS = [...Array(26)].map((a, i) => String.fromCharCode(97 + i).toUpperCase());

  return (
    <Paper>
      <div className={classes.tableWrapper}>
        <table ref={setTableReference}
          onMouseUp={(event) => (onMouseUp ? onMouseUp(event) : null)}
          onMouseDown={(event) => (onMouseDown ? onMouseDown(event) : null)}
          onMouseMove={(event) => (onMouseMove ? onMouseMove(event) : null)}>
          <thead>
            <tr>
              <th></th>
              {CHARACTERS.map(c => <th key={c}><div>{c}</div></th>)}
            </tr>
          </thead>
          <tbody>
            {[...Array(MIN_NUM_ROWS)].map((e, i) => (
              <tr key={`row-${i}`}>
                <td>{i + 1}</td>
                {CHARACTERS.map((c, j) => (
                  <td key={`cell-${j}`}></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Paper>
  )
}


export default Table
