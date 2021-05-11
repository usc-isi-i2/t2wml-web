import React, { useRef, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import CloseIcon from '@material-ui/icons/Close'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'

import useStyles from '../styles/annotationMenu'
import fetchProperties from '../utils/fetchProperties'


const PropertyInput = ({
  selectedProperty,
  onSelectProperty,
}) => {

  const classes = useStyles()

  const timeoutID = useRef(null)

  const [selected, setSelected] = useState(selectedProperty)
  const [properties, setProperties] = useState([])

  const handleOnChange = event => {
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

  const selectProperty = property => {
    onSelectProperty(property)
    setSelected(property)
    setProperties([])
  }

  const removeSelected = () => {
    onSelectProperty()
    setSelected()
  }

  const renderSelectedProperty = () => {
    if ( !selected ) { return null }
    return (
      <Grid container spacing={3}>
        <Grid item xs={10}>
          <p>{`Selected property: ${selected.label[0]} (${selected.qnode})`}</p>
        </Grid>
        <Grid item xs={2}>
          <Tooltip arrow placement="top" title={'remove selected property'}>
            <IconButton onClick={removeSelected}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    )
  }

  const renderPropertySearch = () => {
    if ( !!selected ) { return null }
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
            onChange={handleOnChange} />
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
    <Grid item xs={12}>
      {renderSelectedProperty()}
      {renderPropertySearch()}
    </Grid>
  )
}


export default PropertyInput
