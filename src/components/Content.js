import React, { useCallback, useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'

import useStyles from '../styles/content'

import UploadAnnotationsDialog from './UploadAnnotationsDialog'
import ConfirmationDialog from './ConfirmationDialog'
import Instructions from './Instructions'
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
  const [loadingAnnotations, setLoadingAnnotations] = useState(false)
  const [showApplyAnnotations, setShowApplyAnnotations] = useState(false)
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

  }

  const handleFileUpload = data => {
    setProjectData(data)

    // update the output preview when users upload `.t2wmlz` project files
    if ( !!data.annotations ) {
      updateOutputPreview()
    }
  }

  const guessAnnotations = () => {
    if ( !projectData.filepath ) { return }

    if ( !!outputData && outputData.length >= 1 ) {
      // if there are existing annotations - ask user to confirm this action
      setConfirmationText('Requesting suggested annotations would overwrite all existing annotations, are you sure you want to continue?')
      setShowConfirmation(true)
    } else {
      // fetch suggested annotations and remove any previous annotations
      setLoadingAnnotations(true)
      fetchAnnotations(projectData.filepath, projectData.sheetName)
      .then(suggestedAnnotations => {
        setAnnotations(suggestedAnnotations)
        setLoadingAnnotations(false)
      })
    }
  }

  useEffect(() => {

    // user confirmed to replace annotations with the suggestions
    if ( confirmation ) {
      setConfirmation(false)
      setShowConfirmation(false)

      // fetch suggested annotations and remove any previous annotations
      setLoadingAnnotations(true)
      fetchAnnotations(projectData.filepath, projectData.sheetName)
      .then(suggestedAnnotations => {
        setAnnotations(suggestedAnnotations)
        setLoadingAnnotations(false)
      })
    }
  }, [confirmation, projectData.filepath, projectData.sheetName])

  const handleAnnotationsUpload = data => {
    setProjectData(projectData => {
      return {
        ...projectData,
        annotations: data.annotations,
      }
    })
    setShowApplyAnnotations(false)

    // update the output preview
    updateOutputPreview()
  }

  const showApplyAnnotationsDialog = () => {
    setShowApplyAnnotations(true)
  }

  const closeApplyAnnotationsDialog = () => {
    setShowApplyAnnotations(false)
  }

  const uploadFidil = () => {
    uploadFidilFile(projectData.filepath, projectData.sheetName)
  }


            //<Table
            //  setMessage={setMessage}
            //  projectData={projectData}
            //  suggestedAnnotations={annotations}
            //  updateOutputPreview={updateOutputPreview} />

          //<Divider setColWidth={setColWidth} />
  return (
    <Grid className={classes.content}>
      <Header
        darkTheme={darkTheme}
        project={projectData.project}
        filename={projectData.filepath}
        sheetname={projectData.sheetName}
        guessAnnotations={guessAnnotations}
        loadingAnnotations={loadingAnnotations}
        showApplyAnnotations={showApplyAnnotationsDialog}
        showDownloadOptions={!!outputData && outputData.length >= 1}
        uploadFidilFile={uploadFidil}
        updateProject={handleProjectUpdate}
        switchTheme={() => setDarkTheme(!darkTheme)} />
      {projectData && projectData.table ? (
        <div className={classes.wrapper}>
          <div className={classes.inputWrapper}>
            <div className={classes.divider}></div>
          </div>
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
      <Message message={message} />
      {!!showApplyAnnotations && (
        <UploadAnnotationsDialog
          setMessage={setMessage}
          onUpload={handleAnnotationsUpload}
          filename={projectData.filepath}
          sheetname={projectData.sheetName}
          onClose={closeApplyAnnotationsDialog} />
      )}
      <ConfirmationDialog
        open={showConfirmation}
        text={confirmationText}
        close={() => setShowConfirmation(false)}
        onConfirm={() => setConfirmation(true)} />
    </Grid>
  )
}


export default Content
