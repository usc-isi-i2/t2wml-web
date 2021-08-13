import React, { useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
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
      <React.Fragment>
        <Grid item xs={10}>
          <Typography variant="body1">
            <b>Property:</b> {selected.label}
          </Typography>
          <Typography variant="body1">
            <span>
              <b>Description:</b> {selected.description || '<no description>'}
            </span>
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <IconButton aria-label="delete">
            <EditIcon />
          </IconButton>
        </Grid>
      </React.Fragment>
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
            dataType={dataType}
            setMessage={setMessage}
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
