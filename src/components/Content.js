import React, { useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'

import fetchOutput from '../utils/fetchOutput'
import useStyles from '../styles/content'

import FileDrop from './FileDrop'
import Header from './Header'
import Output from './Output'
import Table from './Table'


const Content = ({darkTheme, setDarkTheme}) => {

  const classes = useStyles()

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

  const updateOutputData = () => {
    fetchOutput(data.filepath, data.sheetName)
      .then(data => setOutputData(data))
      .catch(error => console.log(error))
  }

  useEffect(() => {
    if ( !data ) { return }
    updateOutputData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <Grid className={classes.content}>
      <Header
        filename={data ? data.filepath : ''}
        darkTheme={darkTheme}
        switchTheme={() => setDarkTheme(!darkTheme)} />
      {data ? (
        <Grid container>
          <Grid item xs={8}>
            <Table
              file={data.filepath}
              sheet={data.sheetName}
              data={data.table.cells}
              updateOutputData={updateOutputData} />
          </Grid>
          <Grid item xs={4}>
            {!!outputData && (
              <Output data={outputData.data} />
            )}
          </Grid>
        </Grid>
      ) : (
        <FileDrop onSuccess={data => setData(data)} />
      )}
    </Grid>
  )
}


export default Content
