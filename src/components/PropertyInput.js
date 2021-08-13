import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import EditIcon from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add'

import CreateProperty from './CreateProperty'


const PropertyInput = ({
  file,
  sheet,
  dataType,
  setMessage,
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
            <IconButton aria-label="delete"
              onClick={() => setShowCreateProperty(true)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </React.Fragment>
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
      {renderPropertyCreateButton()}
      {renderPropertyCreateMenu()}
    </Grid>
  )
}


export default PropertyInput
