import React, { useEffect, useRef, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'
import CircularProgress from '@material-ui/core/CircularProgress'
import Autocomplete from '@material-ui/lab/Autocomplete'
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
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(selectedQnode)
  const [showCreateQnode, setShowCreateQnode] = useState()

  useEffect(() => {
    setSelected(selectedQnode)
  }, [selectedQnode])

  const handleOnChange = event => {
    const value = event.target.value
    if ( !value ) {
      setQnodes([])
      setLoading(false)
    } else {
      setLoading(true)
      clearTimeout(timeoutID.current)
      timeoutID.current = setTimeout(() => {
        fetchQnodes(value)
        .then(data => {
          setQnodes(data)
          setLoading(false)
        })
        .catch(error => console.log(error))
      }, 250)
    }
  }

  const handleOnSelectQnode = (event, qnode) => {
    selectQnode(qnode)
  }

  const selectQnode = qnode => {
    onSelectQnode(qnode)
    setSelected(qnode)
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
          <b>{!!selected ? 'Selected Wikidata Item' : 'Select Wikidata Item'}</b>
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
            <Tooltip arrow placement="top" title={'remove selected Wikidata Item'}>
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
              Apply to block
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
          Use this form to connect the cell value to items in Wikidata
        </FormHelperText>
      </Grid>
    )
  }

  const renderQnodeSearch = () => {
    if ( !!selected ) { return }
    return (
      <Grid item xs={12}>
        <Autocomplete
          id="qnode-menu"
          fullWidth={true}
          clearOnBlur={false}
          selectOnFocus={false}
          options={qnodes}
          onChange={handleOnSelectQnode}
          getOptionLabel={property => property.label}
          noOptionsText={'Enter a search term to search for Wikidata items'}
          renderOption={property => (
            <Typography variant="body1">
              <b>{`${property.label} (${property.id})`}</b>
              <br/>
              {property.description}
            </Typography>
          )}
          renderInput={params => (
            <TextField {...params}
              fullWidth
              variant="outlined"
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              label={'Search for Wikidata items'}
              id={'selectedQnode'}
              name={'selectedQnode'}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null }
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              onChange={handleOnChange} />
          )}
        />
      </Grid>
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
          Add a new Wikidata Item
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
      {renderQnodeCreate()}
    </Grid>
  )
}


export default QnodeInput
