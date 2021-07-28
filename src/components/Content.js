import React, { useCallback, useEffect, useState } from 'react'

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

import fetchAnnotations from '../utils/fetchAnnotations'
import fetchPartialCSV from '../utils/fetchPartialCSV'


const Content = ({darkTheme, setDarkTheme}) => {

  const classes = useStyles()

  const [data, setData] = useState()
  const [project, setProject] = useState()
  const [layers, setLayers] = useState(null)
  const [annotations, setAnnotations] = useState([])
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

  const updateOutputPreview = useCallback(() => {
    setTimeout(() => {
      setData(data => {
        fetchPartialCSV(data.filepath, data.sheetName)
        .then(output => setOutputData(output.cells))
        .catch(error => {
          setMessage({
            type: 'error',
            title: `${error.errorCode} - ${error.errorTitle}`,
            text: error.errorDescription,
          })
        })
        return data
      })
    }, 250)
  }, [])

  const handleProjectUpdate = project => {
    // update the project
    setProject(project)

    // update the output preview
    updateOutputPreview()
  }

  const handleFileUpload = data => {
    setData(data)
    setProject(data.project)
    setLayers(data.layers)
    setAnnotations(data.annotations)
  }

  const guessAnnotations = () => {
    if ( !data.filepath ) { return }
    fetchAnnotations(data.filepath, data.sheetName)
    .then(suggestedAnnotations => {
      setAnnotations(suggestedAnnotations)
    })
  }

  return (
    <Grid className={classes.content}>
      <Header
        project={project}
        darkTheme={darkTheme}
        guessAnnotations={guessAnnotations}
        updateProject={handleProjectUpdate}
        switchTheme={() => setDarkTheme(!darkTheme)} />
      {data && data.table ? (
        <div className={classes.wrapper}>
          <div className={classes.inputWrapper}
            style={{ width: `${colWidth}px` }}>
            <Table
              projectData={data}
              setMessage={setMessage}
              suggestedLayers={layers}
              suggestedAnnotations={annotations}
              updateOutputPreview={updateOutputPreview} />
          </div>
          <Divider setColWidth={setColWidth} />
          <div className={classes.outputWrapper}>
            {!!outputData ? (
              <Output
                filename={data.filepath}
                data={outputData} />
            ) : (
              <Instructions />
            )}
          </div>
        </div>
      ) : (
        <FileDrop
          setMessage={setMessage}
          onSuccess={handleFileUpload} />
      )}
      {!!outputData && outputData.length >= 1 && (
        <Download
          project={data.project}
          filename={data.filepath}
          sheetname={data.sheetName} />
      )}
      <Message message={message} />
    </Grid>
  )
}


export default Content
