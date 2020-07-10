import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import { create } from "../editor-core";
import * as CONSTS from "../consts";
import Actions from "./Actions";
import { debounce } from "../editor-core/utils/helpers/PureFns";
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
  const { requester, handleRes, headerRef } = props;
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editorInstanceRef: any = useRef(null);
  const [actionTop, setActionTop] = useState(0);
  const classes = useStyles();

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
    const headerTop = headerRef.current!.getBoundingClientRect().height;
    // set the postion of ActionBar
    const _setActionTop = debounce(function () {
      const currentReqRange = editor.currentReqRange;
      if (currentReqRange) {
        const startLine = currentReqRange.start.lineNumber;
        const startDiv = Array.prototype.find.call(
          document.querySelectorAll(".ace_gutter-cell"),
          (item) => item.innerHTML === startLine.toString()
        );
        if (!startDiv) {
          return setActionTop(999999);
        }
        const top: number = startDiv!.getBoundingClientRect().top;
        setActionTop(top - headerTop);
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
    //eslint-disable-next-line
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
