import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import useStyles from '../styles/annotationMenu'

const PropertyInput = ({
  handleOnSelectProperty,
}) => {

  const classes = useStyles()

  const [properties, setProperties] = useState([])

  const handleOnChange = () => {}

  const selectProperty = property => {
    handleOnSelectProperty(property.qnode)
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
