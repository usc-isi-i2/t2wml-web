import React, { useState } from 'react'

import { Grid } from '@material-ui/core/'

import FileDrop from './FileDrop'
import Table from './Table'


const Content = () => {

  const [data, setData] = useState()

  return (
    <Grid>
      {data ? (
        <Table data={data} />
      ) : (
        <FileDrop onSuccess={data => setData(data)} />
      )}
    </Grid>
  )
}


export default Content
