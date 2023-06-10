import React, { useEffect, useState } from 'react'
import './Home.css';
import { Storage } from 'aws-amplify';
import File from './File';

const Home = () => {
  const [bFiles, setBFiles] = useState([])

  useEffect(() => {
    const filesList = async() => {
      try {
        const { results } = await Storage.list("");
        setBFiles(results);
      } catch (err) {
        console.log(err);
      }
    }
    filesList();
  }, [bFiles])
  
  return (
    <div className="file-list-container">
      {bFiles.map((file, index) => {
        return (
          <div key={index}>
            <File file={file} />
          </div>
        )
      })}
    </div>
  );
}

export default Home