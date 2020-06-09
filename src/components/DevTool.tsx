/**
 * Main Target
 * - interface for request and handleRes
 * - highlight
 * - auto complete
 * - merge into Milvus
 */
import React, { useState, useEffect, useRef } from "react";
import { create } from "../models/sense_editor";
import { useUIAceKeyboardMode } from "../plugins/use_ui_ace_keyboard_mode";
import Button from "@material-ui/core/Button";
import * as CONSTS from "../consts";
import "./DevTool.scss";
const inputId = "ConAppInputTextarea";

const _parseReq = (request: any) => {
  const { method, data, url } = request;
  const params = JSON.parse(data[0].split("\n").join(""));
  return { method, url, params };
};

const DevTools = (props: any) => {
  const { requester, handleRes } = props;
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editorInstanceRef: any = useRef(null);
  const [textArea, setTextArea] = useState<HTMLTextAreaElement | null>(null);
  useUIAceKeyboardMode(textArea);

  const getSession = async () => {
    if (editorInstanceRef.current) {
      const editor = editorInstanceRef.current;
      console.info(editor.getCoreEditor().editor.getSession());
    }
  };
  const getRequest = async () => {
    if (editorInstanceRef.current) {
      const editor = editorInstanceRef.current;
      editor.getRequest().then((res: any) => {
        requester(res).then((res: any) => handleRes(res));
      });
    }
  };
  const getRequests = async () => {
    if (editorInstanceRef.current) {
      const editor = editorInstanceRef.current;
      editor.getRequestsInRange().then((res: any) => {
        Promise.all(
          res.map((data: any) => requester(_parseReq(data)))
        ).then((results: any) => handleRes(results));
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
    // set init value for test
    editor.update(CONSTS.DEFAULT_INPUT_VALUE);
    editor.getCoreEditor().editor.getSession().setTabSize(11);
    setTextArea(textareaElement);
  }, []);

  return (
    <>
      <div id="ConAppEditorActions">
        <Button variant="contained" onClick={getSession}>
          Get Session
        </Button>
        <Button variant="contained" onClick={getRequest}>
          Get Request
        </Button>
        <Button variant="contained" onClick={getRequests}>
          Get Requests
        </Button>
      </div>
      <div ref={editorRef} id="ConAppEditor" />
    </>
  );
};

export default DevTools;
