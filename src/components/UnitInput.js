import React, { useEffect, useRef, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'
import CircularProgress from '@material-ui/core/CircularProgress'
import Autocomplete from '@material-ui/lab/Autocomplete'
import DoneIcon from '@material-ui/icons/Done'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/styles'

import CreateUnit from './CreateUnit'
import fetchUnits from '../utils/fetchUnits'
import * as utils from '../utils/table'


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
  showCreateUnitToggle: {
    '& > span': {
      cursor: 'pointer',
      userSelect: 'none',
      display: 'inline-block',
      marginTop: theme.spacing(2),
    },
  },
}))


const UnitInput = ({
  file,
  sheet,
  selectedUnit,
  onSelectUnit,
  onSubmitUnitCells,
}) => {

  const classes = useStyles()

  const timeoutID = useRef(null)

  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(selectedUnit)
  const [selectedUnitCells, setSelectedUnitCells] = useState('')
  const [units, setUnits] = useState([])
  const [showCreateUnit, setShowCreateUnit] = useState(false)

  useEffect(() => {
    setSelected(selectedUnit)
  }, [selectedUnit])

  const handleOnChangeUnitSearch = event => {
    const value = event.target.value
    if ( !value ) {
      setUnits([])
      setLoading(false)
    } else {
      setLoading(true)
      clearTimeout(timeoutID.current)
      timeoutID.current = setTimeout(() => {
        fetchUnits(value)
        .then(data => {
          setUnits(data)
          setLoading(false)
        })
        .catch(error => console.log(error))
      }, 250)
    }
  }

  const handleOnChangeUnitCells = event => {
    const value = event.target.value
    setSelectedUnitCells(value)
  }

  const submitUnitCells = () => {
    const parsedCorrectly = utils.parseSelectedRangeInput(selectedUnitCells)
    onSubmitUnitCells(parsedCorrectly)
  }

  const handleOnSelectUnit = (event, unit) => {
    selectUnit(unit)
  }

  const selectUnit = unit => {
    onSelectUnit(unit)
    setSelected(unit)
    setUnits([])
  }

  const renderTitle = () => {
    return (
      <Grid item xs={12}>
        <Typography variant="body1">
          <b>{!!selected ? 'Unit' : 'Select Unit'}</b>
        </Typography>
      </Grid>
    )
  }

  const renderSelectedUnit = () => {
    if ( !selected || !selected.label ) { return }
    return (
      <Grid item xs={12}>
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
    )
  }

  const renderUnitCellSelection = () => {
    if ( !!selected ) { return }
    const parsedCorrectly = utils.parseSelectedRangeInput(selectedUnitCells)
    return (
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              id={'selectedUnitCells'}
              name={'selectedUnitCells'}
              label={'Select Unit cell(s)'}
              value={selectedUnitCells}
              error={!!selectedUnitCells && !parsedCorrectly}
              helperText={selectedUnitCells && !parsedCorrectly ? (
                'format: [col][row](:[col][row])?'
              ) : ''}
              onChange={handleOnChangeUnitCells} />
          </Grid>
          <Grid item xs={6}>
            { parsedCorrectly ? (
              <Button
                fullWidth
                size="large"
                color="primary"
                variant="contained"
                style={{height: '100%'}}
                startIcon={<DoneIcon />}
                onClick={submitUnitCells}>
                Submit {selectedUnitCells}
              </Button>
            ) : (
              <FormHelperText component="p" style={{marginTop: '0'}}>
                You can select unit cells in the table or search for a unit in the search box below
              </FormHelperText>
            )}
          </Grid>
        </Grid>
      </Grid>
    )
  }

  const renderUnitSearch = () => {
    if ( !!selected ) { return }
    return (
      <Grid item xs={12}>
        <Autocomplete
          id="units-menu"
          fullWidth={true}
          clearOnBlur={false}
          selectOnFocus={false}
          options={units}
          onChange={handleOnSelectUnit}
          getOptionLabel={unit => unit.label}
          noOptionsText={'Enter a search term to search for units'}
          renderOption={unit => (
            <Typography variant="body1">
              <b>{`${unit.label} (${unit.id})`}</b>
              <br/>
              {unit.description}
            </Typography>
          )}
          renderInput={params => (
            <TextField {...params}
              fullWidth
              variant="outlined"
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              label={'Search for units'}
              id={'selectedUnit'}
              name={'selectedUnit'}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null }
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              onChange={handleOnChangeUnitSearch} />
          )}
        />
      </Grid>
    )
  }

  const renderUnitCreate = () => {
    if ( !!selected ) { return }
    return (
      <Grid item xs={12}>
        <Button
          color="primary"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateUnit(true)}>
          Add a new unit
        </Button>
        {showCreateUnit && (
          <CreateUnit
            file={file}
            sheet={sheet}
            selectUnit={selectUnit}
            hideMenu={() => setShowCreateUnit(false)} />
        )}
      </Grid>
    )
  }

  return (
    <Grid container spacing={3}>
      {renderTitle()}
      {renderSelectedUnit()}
      {renderUnitCellSelection()}
      {renderUnitSearch()}
      {renderUnitCreate()}
    </Grid>
  )
}


export default UnitInput
