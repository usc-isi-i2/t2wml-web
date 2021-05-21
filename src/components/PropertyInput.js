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

import fetchProperties from '../utils/fetchProperties'
import * as utils from '../utils/table'


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
  selectedProperty,
  onSelectProperty,
}) => {

  const classes = useStyles()

  const timeoutID = useRef(null)

  const [selected, setSelected] = useState(selectedProperty)
  const [selectedPropertyCells, setSelectedPropertyCells] = useState()
  const [properties, setProperties] = useState([])
  const [anchorElement, setAnchorElement] = useState()
  const [showCreateProperty, setShowCreateProperty] = useState(false)

  useEffect(() => {
    setSelected(selectedProperty)
  }, [selectedProperty])

  const handleOnChangePropertySearch = event => {
    const value = event.target.value
    if ( !value ) {
      setProperties([])
    } else {
      clearTimeout(timeoutID.current)
      timeoutID.current = setTimeout(() => {
        fetchProperties(value)
        .then(data => {
          if ( data.length ) {
            setAnchorElement(event.target)
          }
          setProperties(data)
        })
        .catch(error => console.log(error))
      }, 250)
    }
  }

  const handleOnChangePropertyCells = event => {
    const value = event.target.value
    setSelectedPropertyCells(value)
  }

  const handleCloseMenu = () => {
    setAnchorElement()
  }

  const selectProperty = property => {
    onSelectProperty(property)
    setSelected(property)
    setAnchorElement()
    setProperties([])
  }

  const removeSelected = () => {
    onSelectProperty()
    setSelected()
  }

  const renderTitle = () => {
    return (
      <Typography className={classes.title}
        style={{marginBottom: !!selected ? '0' : '16px'}}>
        <b>{!!selected ? 'Selected property' : 'Select property'}</b>
      </Typography>
    )
  }

  const renderSelectedProperty = () => {
    if ( !selected || !selected.label ) { return }
    return (
      <Grid container spacing={3}>
        <Grid item xs={10}>
          <Link
            variant="body1"
            className={classes.link}
            target="_blank" rel="noopener noreferrer"
            href={`https://ringgaard.com/kb/${selected.qnode}`}>
            {`${selected.label[0]} (${selected.qnode})`}
          </Link>
          {!!selected.description && !!selected.description.length && (
            <Typography variant="body1">
              {selected.description[0]}
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
    )
  }

  const renderPropertyCellSelection = () => {
    if ( !!selected ) { return }
    const parsedCorrectly = utils.parseSelectedAreaInput(selectedPropertyCells)
    return (
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            variant="outlined"
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
          <FormHelperText component="p" style={{marginTop: '0'}}>
            You can select property cells in the table or search wikidata for a property in the search box below
          </FormHelperText>
        </Grid>
      </Grid>
    )
  }

  const renderPropertySearch = () => {
    if ( !!selected ) { return }
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            autoCorrect="off"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            label={'Search for properties on wikidata'}
            id={'selectedProperty'}
            name={'selectedProperty'}
            onChange={handleOnChangePropertySearch} />
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
        {properties.map(property => (
          <MenuItem key={property.qnode}
            className={classes.menuItem}
            onClick={() => selectProperty(property)}>
            <Typography variant="body1">
              {`${property.label[0]} (${property.qnode})`}
              <br/>
              {property.description[0]}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    )
  }

  const renderCreatePropertyToggle = () => {
    return (
      <Grid item xs={12}>
        <Button
          color="primary"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateProperty(true)}>
          Add a new property
        </Button>
      </Grid>
    )
  }

  const renderPropertyCreate = () => {
    if ( !!selected ) { return }
    return (
      <React.Fragment>
        {renderCreatePropertyToggle()}
      </React.Fragment>
    )
  }

  return (
    <Grid item xs={12} className={classes.wrapper}>
      {renderTitle()}
      {renderSelectedProperty()}
      {renderPropertyCellSelection()}
      {renderPropertySearch()}
      {renderPropertyCreate()}
    </Grid>
  )
}


export default PropertyInput
