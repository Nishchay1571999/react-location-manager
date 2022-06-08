import React, { Fragment, useState } from "react";
import Message from "./Message";
import Progress from "./Progress";
import axios from "axios";
import { convertToHTML } from "draft-convert";
import DOMPurify from "dompurify";
import { EditorState } from "draft-js";
import RichText from "./RichText";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [location, setLocation] = useState("Address");
  const [maplink, setMapLink] = useState("Google Map Link");
  const [filename, setFilename] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("example.email.com");
  const [convertedContent1, setConvertedContent1] = useState(null);
  const [convertedContent2, setConvertedContent2] = useState(null);

  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [editorState1, setEditorState1] = useState(() =>
    EditorState.createEmpty()
  );
  const [editorState2, setEditorState2] = useState(() =>
    EditorState.createEmpty()
  );

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", location);
    formData.append("link", maplink);
    formData.append("description", createMarkup(convertedContent1));
    formData.append("email", email);
    formData.append("emailbody", createMarkup(convertedContent2));

    const convertContentToHTML = (edstate, currstate) => {
      let currentContentAsHTML = convertToHTML(edstate.getCurrentContent());
      currstate(currentContentAsHTML);
    };
    try {
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        },
      });

      // Clear percentage
      setTimeout(() => setUploadPercentage(0), 10000);
      console.log(res);
      const { fileName, filePath, locations, links, descr, em, embody } =
        res.data;

      setUploadedFile({
        fileName,
        filePath,
        locations,
        links,
        descr,
        em,
        embody,
      });

      convertContentToHTML(editorState1, setConvertedContent1);
      convertContentToHTML(editorState2, setConvertedContent2);

      setMessage("File Uploaded");
    } catch (err) {
      if (err.response.status === 500) {
        setMessage("There was a problem with the server");
      } else {
        setMessage(err.response.data.msg);
      }
      setUploadPercentage(0);
    }
  };
  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  const onChangeLoctionHandler = (e) => {
    setLocation(e.target.value);
  };
  const onChangeMapHandler = (e) => {
    setMapLink(e.target.value);
  };
  const onchangeEmail = (e) => {
    setEmail(e.target.value);
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">
            Address
          </span>
          <input
            type="text"
            className="form-control"
            placeholder={Location}
            aria-label="Location"
            aria-describedby="basic-addon1"
            onChange={onChangeLoctionHandler}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">
            Map Link
          </span>
          <input
            type="text"
            className="form-control"
            placeholder={maplink}
            aria-label="Location"
            aria-describedby="basic-addon1"
            onChange={onChangeMapHandler}
          />
        </div>

        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>
        <div>
          <label>Description</label>
          <RichText
            editorState={editorState1}
            setEditorState={setEditorState1}
          />
        </div>
        <div className="input-group mb-3 mt-5">
          <input
            type="text"
            className="form-control"
            placeholder={email}
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            value={email}
            onChange={onchangeEmail}
          />
          <span className="input-group-text" id="basic-addon2">
            @example.com
          </span>
        </div>

        <div>
          <label>Email Body</label>
          <RichText
            editorState={editorState2}
            setEditorState={setEditorState2}
          />
        </div>

        <Progress percentage={uploadPercentage} />

        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-8"
        />
      </form>
      {uploadedFile ? (
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <h3 className="text-center mt-3">{uploadedFile.location}</h3>
            <h3 className="text-center mt-3">{uploadedFile.links}</h3>
            <a href={uploadedFile.links}>Visit Your Location Link</a> 
            <h3 className="text-center mt-3 mb-3">{uploadedFile.fileName}</h3>
            <img style={{ width: "100%" }} src={uploadedFile.filePath} alt="" />
            <div
              dangerouslySetInnerHTML={createMarkup(convertedContent1)}
            ></div>
            <h3 className="text-center mt-3">{uploadedFile.em}</h3>

            <div
              dangerouslySetInnerHTML={createMarkup(convertedContent2)}
            ></div>
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;
