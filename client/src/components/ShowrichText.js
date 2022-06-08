import React, { useState } from "react";

import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import DOMPurify from "dompurify";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";




const ShowRichText = ({editorState,setEditorState}) => {
  const [convertedContent,setConvertedContent]=useState();



  const convertContentToHTML = () => {
    let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(currentContentAsHTML);
  };
  const createMarkup = (html) => {
    convertContentToHTML();
    return {
      __html: DOMPurify.sanitize(html),
    };
  };
  return (
    <div >
      <div
        dangerouslySetInnerHTML={createMarkup(convertedContent)}
      ></div>
    </div>
  );
};
export default ShowRichText;