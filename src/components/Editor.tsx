import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import { create } from "../models/sense_editor";
// is this necessary for us?
// import { useUIAceKeyboardMode } from "../plugins/use_ui_ace_keyboard_mode";
import * as CONSTS from "../consts";
import Actions from "./Actions";
import { debounce } from "../utils/helpers/Purefns";
import "./DevTool.scss";

const inputId = "ConAppInputTextarea";
const EditorID = `CoreEditor`;
const useStyles = (params: any) => {
  const { actionTop = 0 } = params;
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
      right: `20px`,
      zIndex: 100,
      display: actionTop < 0 ? "none" : "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },
  })();
};

const Editor = (props: any) => {
  const { requester, handleRes } = props;
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editorInstanceRef: any = useRef(null);
  const [actionTop, setActionTop] = useState(0);
  const classes = useStyles({ actionTop });
  // const [textArea, setTextArea] = useState<HTMLTextAreaElement | null>(null);
  // useUIAceKeyboardMode(textArea);

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

    // auto calculate marker postions when cursor change or scroll
    const Div_Scroll = document.querySelector(".ace_scrollbar")!;

    const _setActionTop = debounce(function () {
      const currentReqRange = editor.currentReqRange;
      if (currentReqRange) {
        const startLine = currentReqRange.start.lineNumber;
        const div: any = document.querySelector(".ace_line_group")!;
        const height =
          Number.parseFloat(div && div.style && div.style.height) || 16;
        let top = (startLine - 1) * height - Div_Scroll.scrollTop;
        setActionTop(top);
      } else {
        setActionTop(999999);
      }
    });
    coreEditor.on("changeCursor", () => {
      _setActionTop();
    });
    Div_Scroll.addEventListener("scroll", (e: any) => {
      _setActionTop();
    });
    // setTextArea(textareaElement);
  }, []);

  return (
    <div className={classes.root}>
      <Actions
        top={actionTop}
        editor={editorInstanceRef.current}
        requester={requester}
        handleRes={handleRes}
      />
      <div ref={editorRef} id={EditorID} />
    </div>
  );
};

export default Editor;
