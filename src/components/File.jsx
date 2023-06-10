import { Storage } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './File.css';
import AWS from '../awsS3Config';

const File = ({file}) => {
  const [name, setName] = useState("")
  const [fileSize, setFileSize] = useState("");
  const navigate = useNavigate();
  const bucketName = 'dropboxfilesbucket202600-dev';

  useEffect(() => {
    const renameFile = () => {
      let n = file.lastIndexOf('/');
      let result = file.substring(n + 1);
      setName(result);
    }
    renameFile()
    const s3 = new AWS.S3();
    const params = {
      Bucket: bucketName,
      Key: file,
    };
    s3.headObject(params, (err, data) => {
      if (err) {
        console.error('Error retrieving file metadata:', err);
      } else {
        const fileSizeInBytes = data.ContentLength;
        const fileSizeInKB = fileSizeInBytes / 1024;
        const fileSizeInMB = fileSizeInKB / 1024;
        if (Math.round(fileSizeInKB) < 1000) {
          setFileSize(Math.round(`${fileSizeInKB}`) + ' KB')
        } else {
          setFileSize(Math.round(`${fileSizeInMB}`) + " MB")
        }
      }
    });
  }, [file])

  const getFileVersions = async (e) => {
    try {
      const versions = await Storage.list(file.substring(7, parseInt(file.length)), { level: 'public', version: 'all' });
      //console.log("versions: ", versions.results);
      navigate('/file_versions', { state: { myProp: versions.results } });
      // Handle the versions data as required
    } catch (err) {
      console.log(err);
    }
  };

  const getFile = async() => {
    const signedURL = await Storage.get(file.substring(7, parseInt(file.length)))
    window.open(signedURL)
  }

  return (
    <>
        {/* Display file list */}
        <div className="file-item">
          <div className="file-info">
            <div className="file-name" onClick={(e) => getFileVersions(e)} style={{cursor:"pointer"}}>{name}</div>
            <div className="file-size">{fileSize}</div>
            <div className='download-btn' style={{cursor:"pointer", backgroundColor: "blue", padding: "10px", borderRadius: "5px"}} onClick={() => getFile()}>
              Download
            </div>
          </div>
        </div>
    </>
  )
}

export default File