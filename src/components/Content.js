import React, { useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'

import useStyles from '../styles/content'

import Instructions from './Instructions'
import FileDrop from './FileDrop'
import Divider from './Divider'
import Header from './Header'
import Output from './Output'
import Table from './Table'


const Content = ({darkTheme, setDarkTheme}) => {

  const classes = useStyles()

  const [data, setData] = useState()

  const [outputData, setOutputData] = useState()

  const [colWidth, setColWidth] = useState(window.innerWidth * 0.65)

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

  return (
    <Grid className={classes.content}>
      <Header
        filename={data ? data.filepath : ''}
        darkTheme={darkTheme}
        switchTheme={() => setDarkTheme(!darkTheme)} />
      {data ? (
        <React.Fragment>
          <div className={classes.wrapper}
            style={{ width: `${colWidth}px` }}>
            <Table
              file={data.filepath}
              sheet={data.sheetName}
              data={data.table.cells}
              setOutputData={setOutputData} />
          </div>
          <Divider setColWidth={setColWidth} />
          <div className={classes.wrapper}
            style={{ width: `${window.innerWidth - colWidth}px` }}>
            {!!outputData ? (
              <Output filename={data.filepath} data={outputData} />
            ) : (
              <Instructions />
            )}
          </div>
        </React.Fragment>
      ) : (
        <FileDrop onSuccess={data => setData(data)} />
      )}
    </Grid>
  )
}


export default Content
