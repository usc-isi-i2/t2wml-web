import React, { useState } from 'react'

import { Grid } from '@material-ui/core/'

import FileDrop from './FileDrop'
import Header from './Header'
import Table from './Table'


const Content = ({darkTheme, setDarkTheme}) => {

  const [data, setData] = useState()

  return (
    <Grid>
      <Header
        filename={data ? data.filepath : ''}
        darkTheme={darkTheme}
        switchTheme={() => setDarkTheme(!darkTheme)} />
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
