import React from 'react'

import { Grid, Paper } from '@material-ui/core/'

import FileDrop from './FileDrop'


const Content = () => {

  return (
    <Grid container spacing={2} direction="column">
      <FileDrop />
    </Grid>
  )
}


export default Content
