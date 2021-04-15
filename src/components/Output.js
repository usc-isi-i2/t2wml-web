import React from 'react'

import useStyles from '../styles/output'


const Output = ({ data }) => {

  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <pre>{data}</pre>
    </div>
  )
}


export default Output
