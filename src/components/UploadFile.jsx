import React, { useState, useEffect } from 'react';
import './UploadFile.css';
import { Storage } from 'aws-amplify';
import { toast } from 'react-toastify';
import AWS from '../awsS3Config';

function UploadFile() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [width, setWidth] = useState("");
  const [name, setName] = useState("");
  const [errStatus, setErrorStatus] = useState(false);
  const [folderList, setFolderList] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("")

  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);

  const fileInputRef = React.createRef();

  const createFolderInS3 = async (folderName) => {
    const s3 = new AWS.S3();
    const params = {
      Bucket: 'dropboxfilesbucket202600-dev',
      Key: `public/${folderName}/`, // Append a trailing slash to indicate a folder
      ACL: 'private', // Set the desired ACL (Access Control List) for the folder
      Body: ""
    };

    try {
      await s3.putObject(params).promise();
      notifySuccess(`Folder ${folderName} created successfully.`);
    } catch (error) {
      console.error('Error creating folder in S3 bucket:', error);
      notifyError(error)
    }
  };

  const handleCreateFolder = () => {
    if (name === "") {
      setErrorStatus(true);
    } else {
      const folderName = name;
      createFolderInS3(folderName);
      setName("")
    }
  };
  
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFileName(file.name)

    if (file) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  // const handleFormSubmitSingle = async(e) => {
  //   e.preventDefault();
  //   // Do your file upload logic here
  //   console.log("selecetd folder = ", selectedFolder)
  //   try {
  //     await Storage.put(fileName, selectedFile, {
  //       progressCallback(progress) {
  //         console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
  //         setUploadProgress(`Uploaded: ${progress.loaded}/${progress.total}`)
  //         //setWidth();
  //       },
  //     });
  //     notifySuccess("File uploaded successfully")
  //     setPreviewUrl(null)
  //     setUploadProgress("")
  //   } catch (error) {
  //     notifyError("Failed to upload file")
  //   }
  // };

  const subString = (str) => {
    let subLength = str.length;
    let sub = str.substring(7, parseInt(subLength))
    return sub;
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedFolder) {
      // Handle the case where no folder is selected
      notifyError("Please select a folder");
      return;
    }

    if (selectedFile === null) {
      notifyError("Please select a file")
      return;
    }
    
    try {
      console.log('selecetd folder = ', selectedFolder)
      const selected = subString(selectedFolder)
      console.log('selecetd = ', selected)

      const folderKey = selected.endsWith("/")
        ? selected
        : selected + "/";
      console.log('folder key = ', folderKey)

      const fileKey = folderKey + fileName;
  
      await Storage.put(fileKey, selectedFile, {
        progressCallback(progress) {
          const uploadPercentage = Math.round(
            (progress.loaded / progress.total) * 100
          );
          //setUploadProgress(`Uploaded: ${progress.loaded}/${progress.total}`);
          setWidth(`${uploadPercentage}%`);
        },
      });
  
      notifySuccess("File uploaded successfully");
      setPreviewUrl(null);
    } catch (error) {
      notifyError("Failed to upload file");
    }
  };
  

  useEffect(() => {
    const getFoldersFromS3 = async () => {
      const s3 = new AWS.S3();
      const params = {
        Bucket: 'dropboxfilesbucket202600-dev',
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
  }, [])

  return (
    <div className="upload-page">
        {/* start modal for new folder */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Create A Folder</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <form action="">
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label">Folder Name</label>
                        <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter the name of folder" value={name} onChange={(e) => {setName(e.target.value)}} required />
                    </div>
                    {errStatus === true || name === "" ? (
                      <span style={{color: "red"}}>Folder name cannot be empty!!</span>
                    ) : null}
                </form>
            </div>
            <div className="modal-footer">
                <button onClick={() => handleCreateFolder()} type="button" className="btn btn-primary">Create</button>
            </div>
            </div>
        </div>
        </div>
        {/* end modal for new folder */}
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Create Folder
        </button> OR 
        <select value={selectedFolder} onChange={(e) => setSelectedFolder(e.target.value)}>
          <option disabled>Choose a folder</option>
          {folderList.map((folder, index) => {
            return (
              <option key={index} value={folder}>{folder}</option>
            )
          })}
        </select>
        <br />
        
          <label htmlFor="file">Choose a file to upload:</label>
          <input type="file" ref={fileInputRef} onChange={handleFileInputChange} />
        </div>
        {previewUrl && (
          <div className="preview">
            <img src={previewUrl} alt="Preview" />
          </div>
        )}
        <button type="submit">Upload</button> 
        <br />
        <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
          <div className="progress-bar" style={{ width }}></div>
        </div>
      </form>
    </div>
  );
}

export default UploadFile;
// AKIASD45GIJHRLDB3RUV => access key
// /0x29drtMYnoL/FW3peZQsFFC0fUdk7rbARQQWLZ => secret access key
