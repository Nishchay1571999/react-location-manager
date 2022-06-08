import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Switch,
} from "react-router-dom";
import FileUpload from "./components/FileUpload";
import UploadedClient from "./components/UploadedClient";

const App = () => (
  <Router>
    <div className="container mt-4 ">
      <h4 className="display-4 text-center mb-4">React Location Upload</h4>
      <Routes>
        <Route path="/" element={<FileUpload />} />
        <Route path="/uploadedcontent" element={<UploadedClient />} />
      </Routes>
    </div>
  </Router>
);

export default App;
