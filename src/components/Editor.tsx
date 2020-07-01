import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import { create } from "../editor-core";
// is this necessary for us?
// import { useUIAceKeyboardMode } from "../utils/helpers/use_ui_ace_keyboard_mode";
import * as CONSTS from "../consts";
import Actions from "./Actions";
import { debounce } from "../utils/helpers/PureFns";
import "./DevTool.scss";

const inputId = "ConAppInputTextarea";
const EditorID = `CoreEditor`;
const useStyles = makeStyles({
  root: {
    position: "relative",
    width: "50%",
    top: `0 !important`,
  },
  wrapper: {
    flex: "1 1 1px",
    height: "100%",
  },
});

const Editor = (props: any) => {
  const { requester, handleRes } = props;
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editorInstanceRef: any = useRef(null);
  const [actionTop, setActionTop] = useState(0);
  const classes = useStyles();
  // const [textArea, setTextArea] = useState<HTMLTextAreaElement | null>(null);
  // useUIAceKeyboardMode(textArea);

  useEffect(() => {
    // create a MilvusEditor instance.
    const editor = create(editorRef.current!);
    editorInstanceRef.current = editor;
    const textareaElement = editorRef.current!.querySelector("textarea");

    if (textareaElement) {
      textareaElement.setAttribute("id", inputId);
    }

    // set init value for test
    editor.update(CONSTS.DEFAULT_INPUT_VALUE);

    // auto calculate marker postions when cursor change or scroll
    const Div_Scroll = document.querySelector(".ace_scrollbar")!;
    // set the postion of ActionBar
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
    editor.on("changeCursor", () => {
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
      <div ref={editorRef} id={EditorID} className={classes.wrapper} />
    </div>
  );
};

export default Editor;
