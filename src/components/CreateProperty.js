import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'

import DraggablePaper from './DraggablePaper'
import uploadProperty from '../utils/uploadProperty'


const DATA_TYPES = [{
  label: 'Wikibase Item',
  value: 'wikibaseitem',
}, {
  label: 'Wikibase Property',
  value: 'wikibaseproperty',
}, {
  label: 'Quantity',
  value: 'quantity',
}, {
  label: 'Time',
  value: 'time',
}, {
  label: 'String',
  value: 'string',
}, {
  label: 'Monolingual Text',
  value: 'monolingualtext',
}, {
  label: 'Url',
  value: 'url',
}, {
  label: 'External ID',
  value: 'externalid',
}, {
  label: 'Globe Coordinates',
  value: 'globecoordinate',
}]


const useStyles = makeStyles(theme => ({
  menu: {
    position: 'absolute',
    top: theme.spacing(54),
    right: theme.spacing(80),
  },
  form: {
    minHeight: '50px',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))


const CreateProperty = ({ file, sheet, selectProperty, hideMenu }) => {

  const classes = useStyles()

  const [formState, setFormState] = useState({
    qnodeLabel: '',
    qnodeDescription: '',
    qnodeType: '',
  })

  const handleOnSubmit = () => {
    if ( !formState.qnodeLabel ) { return }
    uploadProperty(file, sheet, formState).then(property => {
      selectProperty(property)
      hideMenu()
    })
  }

  const handleOnChange = event => {
    const value = event.target.value
    setFormState({
      ...formState,
      [event.target.name]: value,
    })
  }

  const renderTitle = () => {
    return (
      <React.Fragment>
        Create a new property
        <IconButton onClick={hideMenu}>
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    )
  }

  const renderFormInstructions = () => {
    return (
      <Grid item xs={12}>
        <FormHelperText component="p">
          Use this form to create a new property
        </FormHelperText>
      </Grid>
    )
  }

  const renderLabelInput = () => {
    return (
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="qnodeLabel"
          name="qnodeLabel"
          label="Label"
          variant="outlined"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          inputProps={{'data-lpignore': 'true'}}
          onChange={handleOnChange}
          value={formState.qnodeLabel} />
      </Grid>
    )
  }

  const renderDescriptionInput = () => {
    return (
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="qnodeDescription"
          name="qnodeDescription"
          label="Description"
          variant="outlined"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          inputProps={{'data-lpignore': 'true'}}
          onChange={handleOnChange}
          value={formState.qnodeDescription} />
      </Grid>
    )
  }

  const renderPropertyTypeInput = () => {
    return (
      <Grid item xs={12}>
        <TextField
          select
          fullWidth
          id="qnodeType"
          name="qnodeType"
          label="Data Type"
          variant="outlined"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          onChange={handleOnChange}
          value={formState.qnodeType}>
          {DATA_TYPES.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    )
  }

  const renderContent = () => {
    return (
      <form noValidate autoComplete="off"
        className={classes.form}
        onSubmit={handleOnSubmit}>
        <Grid container spacing={3}>
          {renderFormInstructions()}
          {renderLabelInput()}
          {renderDescriptionInput()}
          {renderPropertyTypeInput()}
        </Grid>
      </form>
    )
  }

  const renderButtons = () => {
    return (
      <Button
        color="primary"
        variant="contained"
        onClick={handleOnSubmit}>
        Submit
      </Button>
    )
  }

  return (
    <Dialog
      open={true}
      onClose={hideMenu}
      classes={{paper: classes.menu}}
      aria-labelledby='dialog-modal-title'
      PaperComponent={DraggablePaper}
      PaperProps={{handle: '.draggable-property-handle'}}>
      <DialogTitle classes={{ root: 'draggable-property-handle' }}>
        {renderTitle()}
      </DialogTitle>
      <DialogContent>
        {renderContent()}
      </DialogContent>
      <DialogActions>
        {renderButtons()}
      </DialogActions>
    </Dialog>
  )
}


export default CreateProperty
