import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import File from './File'


const FileVersions = () => {
  const [fileVersions, setFileVersions] = useState([])
  const location = useLocation()

  useEffect(() => {
    const getProp = () => {
      const myProp = location.state.myProp;
      setFileVersions(myProp)
      console.log(fileVersions)
    }
    getProp()
  }, [location, fileVersions])
  return (
    <div>
      {fileVersions.map((file, index) => {
        return (
          <div key={index}>
            <File file={file.key} />
          </div>
        )
      })}
    </div>
  )
}

export default FileVersions