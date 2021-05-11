import React, { useRef, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

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
    setProperties([])
  }

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            autoCorrect="off"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            label={'Search wikidata property'}
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
    </Grid>
  )
}


export default PropertyInput
