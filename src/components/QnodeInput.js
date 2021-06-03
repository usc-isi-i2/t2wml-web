import React, { useEffect, useRef, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/styles'

import CreateQnode from './CreateQnode'
import fetchQnodes from '../utils/fetchQnodes'

const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.type === 'dark' ? '#99ddff' : '#006699',
    display: 'inline-block',
  },
  removeButton: {
    marginTop: -1 * theme.spacing(2),
    '&:hover': {
      color: 'red',
      transition: 'color 150ms ease',
    },
  },
}))


const QnodeInput = ({
  file,
  sheet,
  selectedQnode,
  onSelectQnode,
}) => {

  const classes = useStyles()

  const timeoutID = useRef(null)

  const [qnodes, setQnodes] = useState([])
  const [selected, setSelected] = useState(selectedQnode)
  const [anchorElement, setAnchorElement] = useState()
  const [showCreateQnode, setShowCreateQnode] = useState()

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
      <Grid item xs={12}>
        <Typography variant="body1">
          <b>{!!selected ? 'Selected qnode' : 'Select qnode'}</b>
        </Typography>
      </Grid>
    )
  }

  const renderSelectedQnode = () => {
    if ( !selected || !selected.label ) { return }
    return (
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={10}>
            <Link
              variant="body1"
              className={classes.link}
              target="_blank" rel="noopener noreferrer"
              href={`https://ringgaard.com/kb/${selected.id}`}>
              {`${selected.label} (${selected.id})`}
            </Link>
            {!!selected.description && (
              <Typography variant="body1">
                {selected.description}
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
      </Grid>
    )
  }

  const renderInstructions = () => {
    if ( !!selected ) { return }
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
    )
  }

  const renderSearchResults = () => {
    return (
      <Menu
        keepMounted
        id="qnode-search-results"
        anchorEl={anchorElement}
        transformOrigin={{
          vertical: -60,
          horizontal: 0,
        }}
        open={!!anchorElement}
        onClose={handleCloseMenu}>
        {qnodes.map(qnode => (
          <MenuItem key={qnode.id}
            onClick={() => selectQnode(qnode)}>
            <Typography variant="body1">
              {`${qnode.label} (${qnode.id})`}
              <br/>
              {qnode.description}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    )
  }

  const renderQnodeCreate = () => {
    if ( !!selected ) { return }
    return (
      <Grid item xs={12}>
        <Button
          color="primary"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateQnode(true)}>
          Add a new qnode
        </Button>
        {showCreateQnode && (
          <CreateQnode
            file={file}
            sheet={sheet}
            selectQnode={setSelected}
            hideMenu={() => setShowCreateQnode(false)} />
        )}
      </Grid>
    )
  }

  return (
    <Grid container spacing={3}>
      {renderTitle()}
      {renderSelectedQnode()}
      {renderInstructions()}
      {renderQnodeSearch()}
      {renderSearchResults()}
      {renderQnodeCreate()}
    </Grid>
  )
}


export default QnodeInput
