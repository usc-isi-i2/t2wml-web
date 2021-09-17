import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'


const filter = createFilterOptions()


const Dropdown = ({ label, options, selected, onSelect }) => {

  const [value, setValue] = useState(null)

  return (
    <Autocomplete
      freeSolo
      id={label}
      value={value}
      onChange={(event, newValue) => {
        if ( typeof newValue === 'string' ) {
          setValue({
            label: newValue,
          })
          onSelect(newValue)
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            label: newValue.inputValue,
          })
          onSelect(newValue.inputValue)
        } else {
          setValue(newValue)
          onSelect(newValue)
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params)

        // Suggest the creation of a new value
        if (params.inputValue !== '') {
          filtered.push({
            inputValue: params.inputValue,
            label: `Add "${params.inputValue}"`,
          })
        }

        return filtered
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue
        }
        // Regular option
        return option.label
      }}
      renderOption={(option) => option.label}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" />
      )}
    />
  )


}


export default Dropdown
