import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import ListAltIcon from '@material-ui/icons/ListAlt'
import { makeStyles } from '@material-ui/styles'

import QnodeInput from './QnodeInput'
import PropertyTags from './PropertyTags'
import PropertyInput from './PropertyInput'
import fetchEntity from '../utils/fetchEntity'
import * as utils from '../utils/table'


const useStyles = makeStyles(theme => ({
  wrapper: {
    marginTop: theme.spacing(1),
  },
}))


const WikificationMenu = ({
  file,
  sheet,
  hideMenu,
  selection,
  setMessage,
  selectedCell,
  targetSelection,
  selectedAnnotation,
  updateOutputPreview,
}) => {

  const classes = useStyles()

  const [showPropertyTagsMenu, setShowPropertyTagsMenu] = useState(false)
  const [entity, setEntity] = useState([])

  const updateEntity = entity => {
    setEntity(entity)
    updateOutputPreview()
  }

  const handleOnSelectQnode = () => {}

  const handleOnSelectProperty = () => {}

  const renderCellContent = () => {
    return (
      <Grid item xs={12}>
        <Typography variant="body1">
          <b>Selected cell:</b> {utils.humanReadableSelection(targetSelection)} {!!selectedCell.value ? `(${selectedCell.value})` : ''}
        </Typography>
      </Grid>
    )
  }

  const renderAnnotationType = () => {
    if ( !selectedAnnotation ) { return }
    return (
      <Grid item xs={12}>
        <Typography variant="body1">
          <b>Annotation role:</b> {selectedAnnotation.role}
        </Typography>
        {!!selectedAnnotation.type && (
          <Typography variant="body1">
            <b>Annotation type:</b> {selectedAnnotation.type}
          </Typography>
        )}
      </Grid>
    )
  }

  const renderSelectedQnode = () => {
    if ( !selectedAnnotation ) { return }
    if ( !selectedCell.qnode ) { return }
    if ( !utils.isWikifyable(selectedAnnotation) ) { return }

    if ( selectedAnnotation.role === 'property' ) {
      return (
        <Grid item xs={12}>
          <PropertyInput
            file={file}
            sheet={sheet}
            setMessage={setMessage}
            selectedAnnotation={selectedAnnotation}
            selectedProperty={selectedCell.qnode}
            onSelectProperty={handleOnSelectProperty} />
        </Grid>
      )
    }
    return (
      <Grid item xs={12}>
        <QnodeInput
          file={file}
          sheet={sheet}
          selectedQnode={selectedCell.qnode}
          selectedAnnotation={selectedAnnotation}
          onSelectQnode={handleOnSelectQnode} />
      </Grid>
    )
  }

  const openPropertyTagsMenu = () => {
    fetchEntity(selectedCell.qnode, file, sheet).then(entity => {
      setEntity(entity)
      setShowPropertyTagsMenu(true)
    })
  }

  const renderPropertyTagsMenu = () => {
    if ( !selectedAnnotation ) { return }
    if ( selectedAnnotation.role !== 'property' ) { return }
    if ( !selectedCell.qnode ) { return }
    return (
      <Grid item xs={12}>
        <Button
          color="primary"
          variant="contained"
          startIcon={<ListAltIcon />}
          onClick={openPropertyTagsMenu}>
          Show Property Tags
        </Button>
        {showPropertyTagsMenu && (
          <PropertyTags
            file={file}
            sheet={sheet}
            entity={entity}
            updateEntity={updateEntity}
            property={selectedCell.qnode}
            hideMenu={() => setShowPropertyTagsMenu(false)} />
        )}
      </Grid>
    )
  }

  return (
    <Grid container spacing={3}
      className={classes.wrapper}>
      {renderCellContent()}
      {renderAnnotationType()}
      {renderSelectedQnode()}
      {renderPropertyTagsMenu()}
    </Grid>
  )
}


export default WikificationMenu
