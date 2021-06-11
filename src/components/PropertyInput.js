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
import ListAltIcon from '@material-ui/icons/ListAlt'
import CloseIcon from '@material-ui/icons/Close'
import DoneIcon from '@material-ui/icons/Done'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/styles'

import CreateProperty from './CreateProperty'
import PropertyTags from './PropertyTags'
import fetchProperties from '../utils/fetchProperties'
import * as utils from '../utils/table'


const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.type === 'dark' ? '#99ddff' : '#006699',
    display: 'inline-block',
  },
  autocompletePaper: {
    maxHeight: '350px',
  },
  removeButton: {
    marginTop: -1 * theme.spacing(2),
    '&:hover': {
      color: 'red',
      transition: 'color 150ms ease',
    },
  },
  showCreatePropertyToggle: {
    '& > span': {
      cursor: 'pointer',
      userSelect: 'none',
      display: 'inline-block',
      marginTop: theme.spacing(2),
    },
  },
}))


const PropertyInput = ({
  file,
  sheet,
  selectedProperty,
  onSelectProperty,
  onSubmitPropertyCells,
}) => {

  const classes = useStyles()

  const timeoutID = useRef(null)

  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(selectedProperty)
  const [selectedPropertyCells, setSelectedPropertyCells] = useState('')
  const [properties, setProperties] = useState([])
  const [showCreateProperty, setShowCreateProperty] = useState(false)
  const [showPropertyTags, setShowPropertyTags] = useState(false)

  useEffect(() => {
    setSelected(selectedProperty)
  }, [selectedProperty])

  const handleOnChangePropertySearch = event => {
    const value = event.target.value
    if ( !value ) {
      setProperties([])
      setLoading(false)
    } else {
      setLoading(true)
      clearTimeout(timeoutID.current)
      timeoutID.current = setTimeout(() => {
        fetchProperties(value)
        .then(data => {
          setProperties(data)
          setLoading(false)
        })
        .catch(error => console.log(error))
      }, 250)
    }
  }

  const handleOnChangePropertyCells = event => {
    const value = event.target.value
    setSelectedPropertyCells(value)
  }

  const submitPropertyCells = () => {
    const parsedCorrectly = utils.parseSelectedRangeInput(selectedPropertyCells)
    onSubmitPropertyCells(parsedCorrectly)
  }

  const selectProperty = (event, property) => {
    onSelectProperty(property)
    setSelected(property)
    setProperties([])
  }

  const removeSelected = () => {
    onSelectProperty()
    setSelected()
  }

  const renderTitle = () => {
    return (
      <Grid item xs={12}>
        <Typography variant="body1">
          <b>{!!selected ? 'Selected property' : 'Select property'}</b>
        </Typography>
      </Grid>
    )
  }

  const renderSelectedProperty = () => {
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
            <Tooltip arrow placement="top" title={'remove selected property'}>
              <IconButton className={classes.removeButton}
                onClick={removeSelected}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  const renderPropertyCellSelection = () => {
    if ( !!selected ) { return }
    const parsedCorrectly = utils.parseSelectedRangeInput(selectedPropertyCells)
    return (
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              id={'selectedPropertyCells'}
              name={'selectedPropertyCells'}
              label={'Select property cell(s)'}
              value={selectedPropertyCells}
              error={!!selectedPropertyCells && !parsedCorrectly}
              helperText={selectedPropertyCells && !parsedCorrectly ? (
                'format: [col][row](:[col][row])?'
              ) : ''}
              onChange={handleOnChangePropertyCells} />
          </Grid>
          <Grid item xs={6}>
            { parsedCorrectly ? (
              <Button
                fullWidth
                size="large"
                color="primary"
                variant="contained"
                style={{height: '100%'}}
                startIcon={<DoneIcon />}
                onClick={submitPropertyCells}>
                Submit {selectedPropertyCells}
              </Button>
            ) : (
              <FormHelperText component="p" style={{marginTop: '0'}}>
                You can select property cells in the table or search Wikidata for a property in the search box below
              </FormHelperText>
            )}
          </Grid>
        </Grid>
      </Grid>
    )
  }

  const renderPropertySearch = () => {
    if ( !!selected ) { return }
    return (
      <Grid item xs={12}>
        <Autocomplete
          id="properties-menu"
          fullWidth={true}
          clearOnBlur={false}
          selectOnFocus={false}
          options={properties}
          onChange={selectProperty}
          getOptionLabel={property => property.label}
          noOptionsText={'Enter a search term to search for properties'}
          classes={{ paper: classes.autocompletePaper }}
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
              label={'Search for properties on Wikidata'}
              id={'selectedProperty'}
              name={'selectedProperty'}
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
              onChange={handleOnChangePropertySearch} />
          )}
        />
      </Grid>
    )
  }

  const renderPropertyCreate = () => {
    if ( !!selected ) { return }
    return (
      <Grid item xs={12}>
        <Button
          color="primary"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateProperty(true)}>
          Add a new property
        </Button>
        {showCreateProperty && (
          <CreateProperty
            file={file}
            sheet={sheet}
            selectProperty={selectProperty}
            hideMenu={() => setShowCreateProperty(false)} />
        )}
      </Grid>
    )
  }

  const renderPropertyTags = () => {
    return (
      <Grid item xs={12}>
        <Button
          color="primary"
          variant="contained"
          startIcon={<ListAltIcon />}
          onClick={() => setShowPropertyTags(true)}>
          Show Property Tags
        </Button>
        {showPropertyTags && (
          <PropertyTags
            tags={tags}
            setTags={setTags}
            hideMenu={() => setShowPropertyTags(false)} />
        )}
      </Grid>
    )
  }

  return (
    <Grid container spacing={3}>
      {renderTitle()}
      {renderSelectedProperty()}
      {renderPropertyCellSelection()}
      {renderPropertySearch()}
      {renderPropertyCreate()}
      {renderPropertyTags()}
    </Grid>
  )
}


export default PropertyInput
