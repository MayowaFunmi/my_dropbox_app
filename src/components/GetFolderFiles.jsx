import React, { useState, useEffect } from 'react'
import AWS from '../awsS3Config';
import { useLocation} from 'react-router-dom'
import File from './File';

const GetFolderFiles = () => {
    const [fileList, setFileList] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const bucketName = location.state.bucketName;
        const folderKey = location.state.folderKey;

        const s3 = new AWS.S3();
        const params = {
          Bucket: bucketName,
          Prefix: folderKey,
        };
    
        const listObjects = async () => {
          try {
            const response = await s3.listObjectsV2(params).promise();
            const files = response.Contents.map((file) => file.Key);
            setFileList(files);
          } catch (error) {
            console.error('Error retrieving file list:', error);
          }
        };
    
        listObjects();
      }, [location.state.bucketName, location.state.folderKey]);
      return (
        <div className="file-list-container">
          {fileList.map((file, index) => {
            return (
              <div key={index}>
                <File file={file} />
              </div>
            )
          })}
        </div>
      );
}

export default GetFolderFiles