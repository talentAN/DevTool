import React, { useState, useEffect, useRef } from "react";
import { create } from "../models/sense_editor";
import { useUIAceKeyboardMode } from "../plugins/use_ui_ace_keyboard_mode";
import Button from "@material-ui/core/Button";
import AceEditor from "react-ace";
import "./DevTool.scss";
const inputId = "ConAppInputTextarea";
const DEFAULT_INPUT_VALUE = `GET _search
{
  "query": {
    "match_all": {}
  }
}`;
const DevTools = (props: any) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editorInstanceRef: any = useRef(null);
  const [textArea, setTextArea] = useState<HTMLTextAreaElement | null>(null);
  useUIAceKeyboardMode(textArea);

  const getRange = async () => {
    if (editorInstanceRef.current) {
      const editor = editorInstanceRef.current;
      editor.getRequestRange().then((res: any) => {
        console.info("xxx", res);
      });
    }
  };
  const getRequest = async () => {
    if (editorInstanceRef.current) {
      const editor = editorInstanceRef.current;
      editor.getRequest().then((res: any) => {
        console.info("yyy", res);
      });
    }
  };

  useEffect(() => {
    // create a senseEditor
    editorInstanceRef.current = create(editorRef.current!);
    const editor = editorInstanceRef.current;
    const textareaElement = editorRef.current!.querySelector("textarea");

    if (textareaElement) {
      textareaElement.setAttribute("id", inputId);
    }
    editor.update(DEFAULT_INPUT_VALUE);

    setTextArea(textareaElement);
  }, []);

  return (
    <>
      <div id="ConAppEditorActions">
        <Button variant="contained" onClick={getRange}>
          Get Range
        </Button>
        <Button variant="contained" onClick={getRequest}>
          Get Request
        </Button>
      </div>
      <div ref={editorRef} id="ConAppEditor" />
    </>
  );
};

export default DevTools;
