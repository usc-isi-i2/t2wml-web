import React, { useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ListAltIcon from '@material-ui/icons/ListAlt'
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/styles'

import CreateProperty from './CreateProperty'
import PropertyTags from './PropertyTags'


const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.type === 'dark' ? '#99ddff' : '#006699',
    display: 'inline-block',
  },
  removeButton: {
    marginTop: -1 * theme.spacing(2),
    '&:hover': {
      color: 'red',
      transition: 'color 150ms ease',
    },
  },
  showCreatePropertyToggle: {
    '& > span': {
      cursor: 'pointer',
      userSelect: 'none',
      display: 'inline-block',
      marginTop: theme.spacing(2),
    },
  },
}))


const PropertyInput = ({
  file,
  sheet,
  selectedProperty,
  onSelectProperty,
  onSubmitPropertyCells,
}) => {

  const classes = useStyles()

  const [tags, setTags] = useState([])
  const [selected, setSelected] = useState(selectedProperty)
  const [showCreateProperty, setShowCreateProperty] = useState(false)
  const [showPropertyTags, setShowPropertyTags] = useState(false)

  useEffect(() => {
    setSelected(selectedProperty)
  }, [selectedProperty])

  const selectProperty = property => {
    onSelectProperty(property)
    setSelected(property)
  }

  const removeSelected = () => {
    onSelectProperty()
    setSelected()
  }

  const renderTitle = () => {
    return (
      <Grid item xs={12}>
        <Typography variant="body1">
          <b>Variable</b>
        </Typography>
      </Grid>
    )
  }

  const renderSelectedProperty = () => {
    if ( !selected || !selected.label ) { return }
    return (
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={10}>
            <Link
              variant="body1"
              className={classes.link}
              target="_blank" rel="noopener noreferrer"
              href={`https://ringgaard.com/kb/${selected.id}`}>
              {`${selected.label} (${selected.id})`}
            </Link>
            {!!selected.description && (
              <Typography variant="body1">
                {selected.description}
              </Typography>
            )}
          </Grid>
          <Grid item xs={2}>
            <Tooltip arrow placement="top" title={'remove property'}>
              <IconButton className={classes.removeButton}
                onClick={removeSelected}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
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
          Add a new variable
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

  const renderPropertyTags = () => {
    if ( !selected || !selected.label ) { return }
    return (
      <Grid item xs={12}>
        <Button
          color="primary"
          variant="contained"
          startIcon={<ListAltIcon />}
          onClick={() => setShowPropertyTags(true)}>
          Show Variable Tags
        </Button>
        {showPropertyTags && (
          <PropertyTags
            tags={tags}
            setTags={setTags}
            property={selected}
            hideMenu={() => setShowPropertyTags(false)} />
        )}
      </Grid>
    )
  }

  return (
    <Grid container spacing={3}>
      {renderTitle()}
      {renderSelectedProperty()}
      {renderPropertyCreate()}
      {renderPropertyTags()}
    </Grid>
  )
}


export default PropertyInput
