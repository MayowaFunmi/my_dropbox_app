import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import UploadFile from './components/UploadFile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileVersions from './components/FileVersions';
import GetFolderFiles from './components/GetFolderFiles';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/upload_file' element={<UploadFile />} />
          <Route path='/file_versions' element={<FileVersions />} />
          <Route path='/folder_files' element={<GetFolderFiles />} />
        </Routes>
        <ToastContainer theme="dark" />
      </div>
    </BrowserRouter>
  );
}

export default App;
