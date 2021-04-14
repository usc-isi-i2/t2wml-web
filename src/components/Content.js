import React, { useEffect, useState } from 'react'

import { Grid } from '@material-ui/core/'

import fetchOutput from '../utils/fetchOutput'

import FileDrop from './FileDrop'
import Header from './Header'
import Table from './Table'


const Content = ({darkTheme, setDarkTheme}) => {

  const [data, setData] = useState()

  const [outputData, setOutputData] = useState()

  const handleOnUnload = event => {
    event.preventDefault()
    event.returnValue = ''
  }

  useEffect(() => {
    // component did mount
    window.addEventListener('beforeunload', handleOnUnload)

    // component will unmount
    return () => {
      window.removeEventListener('beforeunload', handleOnUnload)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if ( !data ) { return }
    fetchOutput(data.filepath, data.sheetName)
      .then(data => console.log(data))
      .catch(error => console.log(error))
  }, [data])

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
