import React, { useRef, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/styles'

import fetchQnodes from '../utils/fetchQnodes'
import * as utils from '../utils/table'


const useStyles = makeStyles(theme => ({
  form: {
    width: '100%',
    minHeight: '250px',
    marginTop: theme.spacing(1),
  },
  menu: {
    padding: 0,
    '& > ul': {
      padding: 0,
      maxWidth: '500px',
      maxHeight: '300px',
      overflowY: 'auto',
    },
  },
  menuItem: {
    '& > p': {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
}))


const WikificationMenu = ({
  hideMenu,
  selection,
  selectedCell,
}) => {

  const classes = useStyles()

  const timeoutID = useRef(null)

  const [results, setResults] = useState([])
  const [selectedQnode, setSelectedQnode] = useState()
  const [anchorElement, setAnchorElement] = useState()

  const handleOnChange = event => {
    const value = event.target.value
    if ( !value ) {
      setResults([])
    } else {
      clearTimeout(timeoutID.current)
      timeoutID.current = setTimeout(() => {
        fetchQnodes(value)
        .then(data => {
          if ( data.length ) {
            setAnchorElement(event.target)
          }
          setResults(data)
        })
        .catch(error => console.log(error))
      }, 250)
    }
  }

  const selectResult = result => {
    setSelectedQnode(result)
    setAnchorElement()
  }

  const handleCloseMenu = () => {
    setAnchorElement()
  }

  const renderFormInstructions = () => {
    return (
      <Grid item xs={12}>
        <FormHelperText component="p">
          Use this form to connect the value(s) to items in wikidata
        </FormHelperText>
      </Grid>
    )
  }

  const renderQnodeSearch = () => {
    return (
      <Grid item xs={12}>
        <TextField
          fullWidth
          variant="outlined"
          label={'Search wikidata'}
          id={'wikidata-search'}
          name={'wikidata-search'}
          onChange={handleOnChange} />
      </Grid>
    )
  }

  const renderQnodeResults = () => {
    return (
      <Menu
        id="qnode-search-results"
        anchorEl={anchorElement}
        classes={{paper: classes.menu}}
        keepMounted
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: -60,
        }}
        open={!!anchorElement}
        onClose={handleCloseMenu}>
        {results.map(result => (
          <MenuItem key={result.qnode}
            className={classes.menuItem}
            onClick={() => selectResult(result)}>
            <Typography variant="body1">
              {`${result.label[0]} (${result.qnode})`}
              <br/>
              {result.description[0]}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    )
  }

  const handleOnSubmit = () => {}

  const renderCellContent = () => {
    return (
      <Grid item xs={12}>
        <Typography variant="body1" paragraph={true}>
          {utils.humanReadableSelection(selectedCell)}: {selectedCell.value}
        </Typography>
        {!!selectedQnode && (
          <p style={{paddingLeft: '12px', color: '#006699'}}>
            qnode: {`${selectedQnode.label[0]} (${selectedQnode.qnode})`}
          </p>
        )}
      </Grid>
    )
  }

  const renderActionButtons = () => {
    return (
      <Grid item xs={12}>
        <Grid container spacing={3} justify="space-between">
          <Grid item>
            <Button
              autoFocus
              color="primary"
              variant="contained"
              onClick={handleOnSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <form noValidate autoComplete="off"
      className={classes.form}
      onSubmit={handleOnSubmit}>
      <Grid container spacing={3}>
        {renderFormInstructions()}
        {renderCellContent()}
        {renderQnodeSearch()}
        {renderQnodeResults()}
        {renderActionButtons()}
      </Grid>
    </form>
  )
}


export default WikificationMenu
