import React, { useEffect, useRef, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import CloseIcon from '@material-ui/icons/Close'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'

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
  removeButton: {
    '&:hover': {
      color: 'red',
      transition: 'color 150ms ease',
    },
  },
  properties: {
    paddingInlineStart: theme.spacing(2),
    marginBlockStart: 0,
    '&> li': {
      paddingBottom: theme.spacing(1),
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline',
      },
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
        .then(data => setProperties(data))
        .catch(error => console.log(error))
      }, 250)
    }
  }

  const handleOnChangePropertyCells = event => {
    const value = event.target.value
    setSelectedPropertyCells(value)
  }

  const selectProperty = property => {
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
          <p>{`${selected.label[0]} (${selected.qnode})`}</p>
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
              'format: [col][row]:[col][row]'
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
            label={'Search wikidata properties'}
            id={'selectedProperty'}
            name={'selectedProperty'}
            onChange={handleOnChangePropertySearch} />
        </Grid>
        <Grid item xs={12}>
          <ol className={classes.properties}>
            {properties.map(property => (
              <li key={property.qnode}
                onClick={() => selectProperty(property)}>
                {`${property.label[0]} (${property.qnode})`}
              </li>
            ))}
          </ol>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid item xs={12} className={classes.wrapper}>
      {renderTitle()}
      {renderSelectedProperty()}
      {renderPropertyCellSelection()}
      {renderPropertySearch()}
    </Grid>
  )
}


export default PropertyInput
