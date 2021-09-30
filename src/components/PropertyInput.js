import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import EditIcon from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add'

import CreateProperty from './CreateProperty'
import * as utils from '../utils/table'


const PropertyInput = ({
  file,
  sheet,
  dataType,
  setMessage,
  annotations,
  selectedProperty,
  onSelectProperty,
}) => {

  const [showCreateProperty, setShowCreateProperty] = useState(false)

  const selectProperty = property => {
    onSelectProperty(property)
  }

  const renderSelectedProperty = () => {
    if ( !selectedProperty || !selectedProperty.label ) { return }
    return (
      <React.Fragment>
        <Grid item xs={10}>
          <Typography variant="body1">
            <b>Property:</b> {selectedProperty.label}
          </Typography>
          <Typography variant="body1">
            <span>
              <b>Description:</b> {selectedProperty.description || '<no description>'}
            </span>
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Tooltip arrow title="edit property" placement="left">
            <IconButton onClick={() => setShowCreateProperty(true)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </React.Fragment>
    )
  }

  const renderPropertySelection = () => {
    let defaultValue = ''
    if ( !annotations || !annotations.length ) { return }
    if ( !!selectedProperty && !!selectedProperty.selection ) {
      defaultValue = utils.humanReadableSelection(selectedProperty.selection)
    }

    const propertyBlocks = annotations.filter(annotation => (
      annotation.role === 'property'
    ))

    // don't bother if there are no property blocks yet
    if ( !propertyBlocks.length ) { return }

    return (
      <Grid item xs={12}>
        <TextField
          select
          fullWidth
          label="Property"
          id="property"
          name="property"
          variant="outlined"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          value={defaultValue}>
          {propertyBlocks.map(property => {
            const label = utils.humanReadableSelection(property.selection)
            return (
              <MenuItem key={property.id} value={label}
                onClick={event => selectProperty(property)}>
                {label}
              </MenuItem>
            )
          })}
        </TextField>
      </Grid>
    )
  }

  const renderPropertyCreateButton = () => {
    if ( !!selectedProperty ) { return }
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

  const renderPropertyCreateMenu = () => {
    if ( !showCreateProperty ) { return }
    return (
      <CreateProperty
        file={file}
        sheet={sheet}
        dataType={dataType}
        setMessage={setMessage}
        selectProperty={selectProperty}
        selectedProperty={selectedProperty}
        hideMenu={() => setShowCreateProperty(false)} />
    )
  }

  return (
    <Grid container spacing={3}>
      {renderSelectedProperty()}
      {renderPropertySelection()}
      {renderPropertyCreateButton()}
      {renderPropertyCreateMenu()}
    </Grid>
  )
}


export default PropertyInput
