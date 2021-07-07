import React, { useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'

import CreateProperty from './CreateProperty'


const PropertyInput = ({
  file,
  sheet,
  selectedProperty,
  onSelectProperty,
}) => {

  const [selected, setSelected] = useState(selectedProperty)
  const [showCreateProperty, setShowCreateProperty] = useState(false)

  useEffect(() => {
    setSelected(selectedProperty)
  }, [selectedProperty])

  const selectProperty = property => {
    onSelectProperty(property)
    setSelected(property)
  }

  const renderSelectedProperty = () => {
    if ( !selected || !selected.label ) { return }
    return (
      <Grid item xs={12}>
        <Typography variant="body1">
          <b>Property:</b> {selected.label}
        </Typography>
        {!!selected.description && (
          <Typography variant="body1">
            <b>Description:</b> {selected.description}
          </Typography>
        )}
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

  return (
    <Grid container spacing={3}>
      {renderSelectedProperty()}
      {renderPropertyCreate()}
    </Grid>
  )
}


export default PropertyInput
