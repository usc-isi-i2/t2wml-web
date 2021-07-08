import React, { useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'

import DraggablePaper from './DraggablePaper'
import uploadEntity from '../utils/uploadEntity'
import { TAGS } from '../content/tag-options'


const useStyles = makeStyles(theme => ({
  menu: {
    position: 'absolute',
    top: theme.spacing(4),
    right: theme.spacing(80),
  },
}))


const PropertyTags = ({ file, sheet, entity, setEntity, hideMenu }) => {

  const classes = useStyles()

  const [tags, setTags] = useState([])
  const [formState, setFormState] = useState({
    newTagKey: '',
    newTagValue: '',
  })

  useEffect(() => {
    if ( !!entity.tags ) {
      setTags(entity.tags)
    }
  }, [entity])

  const handleOnChange = event => {
    const value = event.target.value
    setFormState({
      ...formState,
      [event.target.name]: value,
    })
  }

  const handleOnTagChange = (event, tag) => {
    const value = event.target.value
    tag[event.target.name] = value
  }

  const saveNewTag = () => {
    if ( !formState.newTagKey || !formState.newTagValue ) { return }
    tags.push({
      key: formState.newTagKey,
      value: formState.newTagValue,
    })
    uploadEntity(entity, tags, file, sheet)
    .then(entity => {
      setEntity(entity)
      setFormState({
        newTagKey: '',
        newTagValue: '',
      })
    })
  }

  const updateTag = tag => {
    // if both key and value are empty, remove this tag
    if ( !tag.key && !tag.value ) {
      if (tags.hasKey(tag.key)){
          tags.delete(tag.key)
      }
    } else {
      tags[tag.key]=tag.value
    }

    // convert all tags to strings with key and value separated by a colon
    uploadEntity(entity, tags, file, sheet)
    .then(entity => setEntity(entity))
  }

  const renderTitle = () => {
    return (
      <React.Fragment>
        Property Tags - {entity.label}
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
          Use this form to edit property tags
        </FormHelperText>
      </Grid>
    )
  }

  const renderNewTagInputs = () => {
    return (
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              id="newTagKey"
              name="newTagKey"
              label="Key"
              variant="outlined"
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              inputProps={{'data-lpignore': 'true'}}
              onChange={handleOnChange}
              onBlur={saveNewTag}
              value={formState.newTagKey} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              id="newTagValue"
              name="newTagValue"
              label="Value"
              variant="outlined"
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              inputProps={{'data-lpignore': 'true'}}
              onChange={handleOnChange}
              onBlur={saveNewTag}
              value={formState.newTagValue} />
          </Grid>
        </Grid>
      </Grid>
    )
  }

  const renderDefaultTags = () => {
    return TAGS.map(tag => (
      <Grid item xs={12} key={tag.key}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              name="key"
              label="Key"
              variant="outlined"
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              inputProps={{'data-lpignore': 'true'}}
              onChange={event => handleOnTagChange(event, tag)}
              onBlur={() => updateTag(tag)}
              defaultValue={tag.key} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              name="value"
              label="Value"
              variant="outlined"
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              inputProps={{'data-lpignore': 'true'}}
              onChange={event => handleOnTagChange(event, tag)}
              onBlur={() => updateTag(tag)}
              defaultValue={tag.value} />
          </Grid>
        </Grid>
      </Grid>
    ))
  }

  const renderPropertyTags = () => {
    console.log("Tags", tags)
    if (Array.isArray(tags)){return;}
    debugger
    const arr= []

    for (const key in tags)

    arr.push(
      <Grid item xs={12} key={key}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              name="key"
              label="Key"
              variant="outlined"
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              inputProps={{'data-lpignore': 'true'}}
              onChange={event => handleOnTagChange(event, {key: key, value: tags[key]})}
              onBlur={() => updateTag({key: key, value: tags[key]})}
              defaultValue={key} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              name="value"
              label="Value"
              variant="outlined"
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              inputProps={{'data-lpignore': 'true'}}
              onChange={event => handleOnTagChange(event, {key: key, value: tags[key]})}
              onBlur={() => updateTag({key: key, value: tags[key]})}
              defaultValue={tags[key]} />
          </Grid>
        </Grid>
      </Grid>
    )
  }

  const renderContent = () => {
    return (
      <Grid container spacing={3}>
        {renderFormInstructions()}
        {renderDefaultTags()}
        {renderPropertyTags()}
        {renderNewTagInputs()}
      </Grid>
    )
  }

  const renderButtons = () => {}

  return (
    <Dialog
      open={true}
      onClose={hideMenu}
      classes={{paper: classes.menu}}
      aria-labelledby='dialog-modal-title'
      PaperComponent={DraggablePaper}
      PaperProps={{handle: '.draggable-property-tags-handle'}}>
      <DialogTitle classes={{ root: 'draggable-property-tags-handle' }}>
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


export default PropertyTags
