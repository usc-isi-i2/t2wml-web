import React from 'react'

import Box from '@material-ui/core/Box'


const TabPanel = ({children, value, index, ...other}) => {

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}>
      {value === index && (
        <Box>{children}</Box>
      )}
    </div>
  )
}


export default TabPanel
