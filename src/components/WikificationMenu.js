import React, { useRef, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/styles'


import fetchQnodes from '../utils/fetchQnodes'


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

  const handleOnSubmit = () => {}

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


export default WikificationMenu
