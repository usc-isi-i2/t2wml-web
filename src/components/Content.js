import React, { useCallback, useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'

import useStyles from '../styles/content'

import UploadAnnotationsDialog from './UploadAnnotationsDialog'
import ConfirmationDialog from './ConfirmationDialog'
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
import uploadFidilFile from '../utils/uploadFidilFile'


const Content = ({darkTheme, setDarkTheme}) => {

  const classes = useStyles()

  const [projectData, setProjectData] = useState({})
  const [annotations, setAnnotations] = useState()
  const [outputData, setOutputData] = useState()
  const [message, setMessage] = useState({})
  const [confirmation, setConfirmation] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showUploadAnnotations, setShowUploadAnnotations] = useState(false)
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
      setProjectData(projectData => {
        fetchPartialCSV(projectData.filepath, projectData.sheetName)
        .then(output => setOutputData(output.cells))
        .catch(error => {
          setMessage({
            type: 'error',
            title: `${error.errorCode} - ${error.errorTitle}`,
            text: error.errorDescription,
          })
        })
        return projectData
      })
    }, 250)
  }, [])

  const handleProjectUpdate = project => {

    // update the project
    setProjectData(projectData => {
      projectData.project = project
      return projectData
    })

    // update the output preview
    updateOutputPreview()
  }

  const handleFileUpload = data => {
    setProjectData(data)
  }

  const guessAnnotations = () => {
    if ( !projectData.filepath ) { return }

    setConfirmationText('Requesting suggested annotations would overwrite all existing annotations, are you sure you want to continue?')
    setShowConfirmation(true)
  }

  const handleAnnotationsUpload = annotations => {
  }

  const uploadFidil = () => {
    uploadFidilFile()
  }

  useEffect(() => {

    // user confirmed to replace annotations with the suggestions
    if ( confirmation ) {
      setConfirmation(false)
      setShowConfirmation(false)

      // fetch suggested annotations and remove any previous annotations
      fetchAnnotations(projectData.filepath, projectData.sheetName)
      .then(suggestedAnnotations => {
        setAnnotations(suggestedAnnotations)
      })
    }
  }, [confirmation, projectData.filepath, projectData.sheetName])

  return (
    <Grid className={classes.content}>
      <Header
        project={projectData.project}
        darkTheme={darkTheme}
        guessAnnotations={guessAnnotations}
        showUploadAnnotations={() => setShowUploadAnnotations(true)}
        uploadFidilFile={uploadFidil}
        updateProject={handleProjectUpdate}
        switchTheme={() => setDarkTheme(!darkTheme)} />
      {projectData && projectData.table ? (
        <div className={classes.wrapper}>
          <div className={classes.inputWrapper}
            style={{ width: `${colWidth}px` }}>
            <Table
              setMessage={setMessage}
              projectData={projectData}
              suggestedAnnotations={annotations}
              updateOutputPreview={updateOutputPreview} />
          </div>
          <Divider setColWidth={setColWidth} />
          <div className={classes.outputWrapper}>
            {!!outputData ? (
              <Output
                filename={projectData.filepath}
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
          project={projectData.project}
          filename={projectData.filepath}
          sheetname={projectData.sheetName} />
      )}
      <Message message={message} />
      <UploadAnnotationsDialog
        open={showUploadAnnotations}
        close={() => setShowUploadAnnotations(false)}
        onUpload={handleAnnotationsUpload} />
      <ConfirmationDialog
        open={showConfirmation}
        text={confirmationText}
        close={() => setShowConfirmation(false)}
        onConfirm={() => setConfirmation(true)} />
    </Grid>
  )
}


export default Content
