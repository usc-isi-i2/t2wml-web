import React, { useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/styles'

import CreateQnode from './CreateQnode'

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
}))


const QnodeInput = ({
  file,
  sheet,
  selectedQnode,
  onSelectQnode,
  selectedAnnotation,
}) => {

  const classes = useStyles()

  const [selected, setSelected] = useState(selectedQnode)
  const [showCreateQnode, setShowCreateQnode] = useState()

  useEffect(() => {
    setSelected(selectedQnode)
  }, [selectedQnode])

  const removeSelected = () => {
    onSelectQnode()
    setSelected()
  }

  const renderTitle = () => {
    return (
      <Grid item xs={12}>
        <Typography variant="body1">
          <b>{selectedAnnotation.role === 'property' ? 'Variable' : 'Country'}</b>
        </Typography>
      </Grid>
    )
  }

  const renderSelectedQnode = () => {
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
            <Tooltip arrow placement="top" title={'remove selected country'}>
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

  const renderInstructions = () => {
    if ( !!selected ) { return }
    return (
      <Grid item xs={12}>
        <FormHelperText component="p">
          Use this form to connect the cell value to a country
        </FormHelperText>
      </Grid>
    )
  }

  const renderQnodeCreate = () => {
    if ( !!selected ) { return }
    return (
      <Grid item xs={12}>
        <Button
          color="primary"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateQnode(true)}>
          Add a new country
        </Button>
        {showCreateQnode && (
          <CreateQnode
            file={file}
            sheet={sheet}
            selectQnode={setSelected}
            hideMenu={() => setShowCreateQnode(false)} />
        )}
      </Grid>
    )
  }

  return (
    <Grid container spacing={3}>
      {renderTitle()}
      {renderSelectedQnode()}
      {renderInstructions()}
      {renderQnodeCreate()}
    </Grid>
  )
}


export default QnodeInput
