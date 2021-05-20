import React, { useEffect, useRef, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import CloseIcon from '@material-ui/icons/Close'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'
import { makeStyles } from '@material-ui/styles'

import fetchQnodes from '../utils/fetchQnodes'

const useStyles = makeStyles(theme => ({
  wrapper: {
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  title: {
    fontSize: theme.spacing(2),
  },
  link: {
    color: theme.palette.type === 'dark' ? '#99ddff' : '#006699',
    marginTop: theme.spacing(2),
    display: 'inline-block',
  },
  removeButton: {
    '&:hover': {
      color: 'red',
      transition: 'color 150ms ease',
    },
  },
  menu: {
    padding: 0,
    '& > ul': {
      padding: 0,
      maxWidth: '500px',
      maxHeight: '300px',
      overflowY: 'auto',
    },
  },
  menuItem: {
    '& > p': {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
}))


const QnodeInput = ({
  selectedQnode,
  onSelectQnode,
}) => {

  const classes = useStyles()

  const timeoutID = useRef(null)

  const [qnodes, setQnodes] = useState([])
  const [selected, setSelected] = useState(selectedQnode)
  const [anchorElement, setAnchorElement] = useState()

  useEffect(() => {
    setSelected(selectedQnode)
  }, [selectedQnode])

  const handleOnChange = event => {
    const value = event.target.value
    if ( !value ) {
      setQnodes([])
    } else {
      clearTimeout(timeoutID.current)
      timeoutID.current = setTimeout(() => {
        fetchQnodes(value)
        .then(data => {
          if ( data.length ) {
            setAnchorElement(event.target)
          }
          setQnodes(data)
        })
        .catch(error => console.log(error))
      }, 250)
    }
  }

  const handleCloseMenu = () => {
    setAnchorElement()
  }

  const selectQnode = qnode => {
    onSelectQnode(qnode)
    setSelected(qnode)
    setAnchorElement()
    setQnodes([])
  }

  const removeSelected = () => {
    onSelectQnode()
    setSelected()
  }

  const applyToBlock = () => {}

  const renderTitle = () => {
    return (
      <Typography className={classes.title}
        style={{marginBottom: !!selected ? '0' : '16px'}}>
        <b>{!!selected ? 'Selected qnode' : 'Select qnode'}</b>
      </Typography>
    )
  }

  const renderSelectedQnode = () => {
    if ( !selected || !selected.label ) { return }
    return (
      <Grid container spacing={3}>
        <Grid item xs={10}>
          {!!selected && (
            <Link
              variant="body1"
              className={classes.link}
              target="_blank" rel="noopener noreferrer"
              href={`https://ringgaard.com/kb/${selected.qnode}`}>
              {`${selected.label[0]} (${selected.qnode})`}
            </Link>
          )}
          {!!selected.description && !!selected.description.length && (
            <Typography variant="body1">
              {selected.description[0]}
            </Typography>
          )}
        </Grid>
        <Grid item xs={2}>
          <Tooltip arrow placement="top" title={'remove selected qnode'}>
            <IconButton className={classes.removeButton}
              onClick={removeSelected}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          <Button
            color="primary"
            variant="contained"
            onClick={applyToBlock}>
            Apply selected Qnode to the block
          </Button>
        </Grid>
      </Grid>
    )
  }

  const renderInstructions = () => {
    return (
      <Grid item xs={12}>
        <FormHelperText component="p">
          Use this form to connect the cell value to items in wikidata
        </FormHelperText>
      </Grid>
    )
  }

  const renderQnodeSearch = () => {
    if ( !!selected ) { return }
    return (
      <Grid container spacing={3}>
        {renderInstructions()}
        <Grid item xs={12}>
          <TextField
            fullWidth
            autoCorrect="off"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            variant="outlined"
            label={'Search for qnodes on wikidata'}
            id={'wikidata-search'}
            name={'wikidata-search'}
            onChange={handleOnChange} />
        </Grid>
        {renderSearchResults()}
      </Grid>
    )
  }

  const renderSearchResults = () => {
    return (
      <Menu
        id="qnode-search-results"
        anchorEl={anchorElement}
        classes={{paper: classes.menu}}
        keepMounted
        transformOrigin={{
          vertical: -60,
        }}
        open={!!anchorElement}
        onClose={handleCloseMenu}>
        {qnodes.map(qnode => (
          <MenuItem key={qnode.qnode}
            className={classes.menuItem}
            onClick={() => selectQnode(qnode)}>
            <Typography variant="body1">
              {`${qnode.label[0]} (${qnode.qnode})`}
              <br/>
              {qnode.description[0]}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    )
  }

  return (
    <Grid item xs={12} className={classes.wrapper}>
      {renderTitle()}
      {renderSelectedQnode()}
      {renderQnodeSearch()}
    </Grid>
  )
}


export default QnodeInput
