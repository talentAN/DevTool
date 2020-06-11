/**
 * Main Target
 * - interface for request and handleRes => done
 * - highlight => done
 * - Get request fail
 * - auto complete =>
 * - merge into Milvus => 
 */
import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import IconButton from "@material-ui/core/IconButton";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import DeleteIcon from "@material-ui/icons/Delete";
import { create } from "../models/sense_editor";
import { useUIAceKeyboardMode } from "../plugins/use_ui_ace_keyboard_mode";
import * as CONSTS from "../consts";
import "./DevTool.scss";
const inputId = "ConAppInputTextarea";

const useStyles = (params: any) => {
  const { actionTop } = params;
  return makeStyles({
    root: {
      position: "relative",
      width: "50%",
      top: `0 !important`,
    },
    actions: {
      position: "absolute",
      width: "100%",
      height: "20px",
      top: `${actionTop}px`,
      left: 0,
      zIndex: 100,
      display:'flex',
      alignItems:"center",
      justifyContent:"flex-end"
    },
  })();
};
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
  const [actionTop, setActionTop] = useState(0);
  const classes = useStyles({ actionTop });
  useUIAceKeyboardMode(textArea);

  const getSession = async (e: any) => {
    if (editorInstanceRef.current) {
      const editor = editorInstanceRef.current;
      console.info(
        editor.getCoreEditor().editor.getSession().doc.$lines.join("\r")
      );
    }
  };
  const getRequests = async (e: any) => {
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
    const coreEditor = editor.getCoreEditor();
    let timeout: any;
    coreEditor.on("changeCursor", () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        const currentReqRange = editor.currentReqRange;
        if (currentReqRange) {
          const startLine = currentReqRange.start.lineNumber;
          const div:any = document.querySelector('.ace_line_group')!;
          const height = Number.parseFloat(div && div.style && div.style.height) || 16;
          const top = (startLine - 1) * height;
          setActionTop(top);
        } else {
          setActionTop(999999);
        }
      }, 50);
    });

    setTextArea(textareaElement);
  }, []);

  return (
    <>
      <div id="ConAppEditorActions" className={classes.root}>
        <div className={classes.actions}>
          <IconButton size="small" onClick={getSession}>
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={getRequests}>
            <ArrowRightIcon fontSize="small" />
          </IconButton>
        </div>
        <div ref={editorRef} id="ConAppEditor" />
      </div>
    </>
  );
};

export default DevTools;
