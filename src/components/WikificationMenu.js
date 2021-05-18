import React, { useRef, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import FormHelperText from '@material-ui/core/FormHelperText'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/styles'

import Draggable from 'react-draggable'

import fetchQnodes from '../utils/fetchQnodes'
import * as utils from '../utils/table'


const useStyles = makeStyles(theme => ({
  menu: {
    position: 'absolute',
    top: theme.spacing(12),
    right: theme.spacing(5),
  },
  results: {
    paddingInlineStart: theme.spacing(2),
    marginBlockStart: 0,
    '&> li': {
      paddingBottom: theme.spacing(1),
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline',
      },
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

  const handleOnChange = event => {
    const value = event.target.value
    if ( !value ) {
      setResults([])
    } else {
      clearTimeout(timeoutID.current)
      timeoutID.current = setTimeout(() => {
        fetchQnodes(value)
        .then(data => setResults(data))
        .catch(error => console.log(error))
      }, 250)
    }
  }

  const selectResult = result => {
    setSelectedQnode(result)
  }

  const renderTitle = () => {
    return (
      <React.Fragment>
        {`Wikify this ${utils.isBlock(selection) ? 'block' : 'cell'}`}
        <IconButton aria-label="close" onClick={hideMenu}>
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    )
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
      <Grid item xs={12}>
        <ol className={classes.results}>
          {results.map(result => (
            <li key={result.qnode}
              onClick={() => selectResult(result)}>
              {`${result.label[0]} (${result.qnode})`}
              <Typography variant="inherit" paragraph={true}>
                {result.description[0]}
              </Typography>
            </li>
          ))}
        </ol>
      </Grid>
    )
  }

  const renderContent = () => {
    return (
      <Grid container spacing={3}>
        {renderFormInstructions()}
        <Grid item xs={12}>
          <p style={{paddingLeft: '12px'}}>value: {selectedCell}</p>
          {!!selectedQnode && (
            <p style={{paddingLeft: '12px', color: '#006699'}}>
              qnode: {`${selectedQnode.label[0]} (${selectedQnode.qnode})`}
            </p>
          )}
        </Grid>
        {renderQnodeSearch()}
        {renderQnodeResults()}
      </Grid>
    )
  }

  const handleOnSubmit = () => {}

  const renderActions = () => {
    return (
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
    )
  }

  return (
    <Dialog
      open={true}
      onClose={hideMenu}
      classes={{ paper: classes.menu }}
      PaperProps={{ tabIndex: -1 }}
      TransitionComponent={Draggable}
      TransitionProps={{ handle: '.draggable-handle' }}>
      <DialogTitle classes={{ root: 'draggable-handle' }}>
        {renderTitle()}
      </DialogTitle>
      <DialogContent>
        {renderContent()}
      </DialogContent>
      <DialogActions>
        {renderActions()}
      </DialogActions>
    </Dialog>
  )
}


export default WikificationMenu
