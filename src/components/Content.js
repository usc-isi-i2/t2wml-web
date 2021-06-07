import React, { useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'

import useStyles from '../styles/content'

import Instructions from './Instructions'
import Download from './Download'
import FileDrop from './FileDrop'
import Divider from './Divider'
import Message from './Message'
import Header from './Header'
import Output from './Output'
import Table from './Table'


const Content = ({darkTheme, setDarkTheme}) => {

  const classes = useStyles()

  const [data, setData] = useState()
  const [message, setMessage] = useState({})
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
      {data && data.table ? (
        <div className={classes.wrapper}>
          <div className={classes.inputWrapper}
            style={{ width: `${colWidth}px` }}>
            <Table
              file={data.filepath}
              sheet={data.sheetName}
              data={data.table.cells}
              setOutputData={setOutputData} />
          </div>
          <Divider setColWidth={setColWidth} />
          <div className={classes.outputWrapper}>
            {!!outputData ? (
              <Output filename={data.filepath} data={outputData} />
            ) : (
              <Instructions />
            )}
          </div>
        </div>
      ) : (
        <FileDrop
          onSuccess={setData} setMessage={setMessage} />
      )}
      {!!outputData && outputData.length > 1 && (
        <Download
          filename={data.filepath}
          sheetname={data.sheetName} />
      )}
      <Message message={message} />
    </Grid>
  )
}


export default Content
