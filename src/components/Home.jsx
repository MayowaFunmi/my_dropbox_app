import React, { useEffect, useState } from 'react'
import './Home.css';
import AWS from '../awsS3Config';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [folderList, setFolderList] = useState([]);
  const bucketName = 'dropboxfilesbucket202600-dev';
  const navigate = useNavigate();

  const getFiles = (bucketName, folder) => {
    navigate('/folder_files', { state: { bucketName: bucketName, folderKey: folder}})
  }

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken || refreshToken) {
      const getFoldersFromS3 = async () => {
        const s3 = new AWS.S3();
        const params = {
          Bucket: bucketName,
          Delimiter: '/',
          Prefix: 'public/'
        };
    
        try {
          const response = await s3.listObjectsV2(params).promise();
          const folders = response.CommonPrefixes.map((commonPrefix) => commonPrefix.Prefix);
          //return folders;
          setFolderList(folders)
          //console.log('List of folders:', folderList);
        } catch (error) {
          console.error('Error retrieving folders from S3 bucket:', error);
          return [];
        }
      };
      getFoldersFromS3()
    } else {
      navigate('/signin')
    }
  }, [navigate])
  
  return (
    <div className="container">
        <h3 className='mt-3'>File Storage System Using React And AWS</h3>
        <ol className="list-group list-group-numbered">
            {folderList.map((folder, index) => {
                return (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold" onClick={() => getFiles(bucketName, folder)} style={{cursor: "pointer"}}>
                                {folder.substring(7, parseInt(folder.length))}
                            </div>
                        </div>
                        <span className="badge bg-primary rounded-pill"></span>
                    </li>
                )
            })}
        </ol>
    </div>
  );
}

export default Home