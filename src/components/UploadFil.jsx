import React, { useState } from 'react';
import './UploadFile.css';
import { Storage } from 'aws-amplify';
import { toast } from 'react-toastify';

function UploadFile() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");
  const [width, setWidth] = useState("");
  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);

  const fileInputRef = React.createRef();

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

  const handleFormSubmit = async(e) => {
    e.preventDefault();
    // Do your file upload logic here
    try {
      await Storage.put(fileName, selectedFile, {
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          setUploadProgress(`Uploaded: ${progress.loaded}/${progress.total}`)
          setWidth();
        },
      });
      notifySuccess("File uploaded successfully")
      setPreviewUrl(null)
      setUploadProgress("")
    } catch (error) {
      notifyError("Failed to upload file")
    }
    
  };

  return (
    <div className="upload-page">
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
        <label htmlFor="file">File:</label>
        <input type="file" ref={fileInputRef} onChange={handleFileInputChange} />
        </div>
        {previewUrl && (
          <div className="preview">
            <img src={previewUrl} alt="Preview" />
          </div>
        )}
        <button type="submit">Upload</button>
        <p>{uploadProgress}</p>
        <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
          <div className="progress-bar" style={{width: {width}}}></div>
        </div>
      </form>
    </div>
  );
}

export default UploadFile;
