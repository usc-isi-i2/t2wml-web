import React, { useState } from 'react'

import { Grid } from '@material-ui/core/'

import FileDrop from './FileDrop'
import Table from './Table'


const Content = () => {

  const [data, setData] = useState()

  return (
    <Grid>
      {data ? (
        <Table
          file={data.filepath}
          sheet={data.sheetName}
          data={data.table.cells} />
      ) : (
        <FileDrop onSuccess={data => setData(data)} />
      )}
    </Grid>
  )
}


export default Content
