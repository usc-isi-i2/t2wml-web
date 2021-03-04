import React, { useState } from 'react'

import { Grid } from '@material-ui/core/'

import FileDrop from './FileDrop'
import Table from './Table'


const Content = () => {

  const [inputMode, setInputMode] = useState(true)

  return (
    <Grid container spacing={2} direction="column">
      {inputMode ? <FileDrop onSuccess={() => setInputMode(false)} /> : <Table />}
    </Grid>
  )
}


export default Content
