import React, { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import { PureBlackboard } from "../models/legacy_core_editor/blackboard";
import * as ace from "brace";
import "brace/mode/javascript";
import "brace/theme/monokai";
import "./DevTool.scss";

const useStyles = (params: any) => {
  return makeStyles({
    root: {
      position: "relative",
      width: "50%",
      top: `0 !important`,
    },
  })();
};

const Blackboard = (props: any) => {
  const { value } = props;
  const classes = useStyles({});
  const blackboardRef: any = useRef(null);
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      const aceEditor = ace.edit("blackboard");
      const editor = new PureBlackboard(aceEditor);
      blackboardRef.current = editor;
      editor.editor.getSession().setMode("ace/mode/json");
      editor.editor.setTheme("ace/theme/solarized_light");
      editor.editor.setShowPrintMargin(false);
      editor.editor.container.style.fontSize = "1rem";
    }
    blackboardRef.current.editor.setValue(value,1);
  }, [value]);

  return <div id="blackboard" className={classes.root} />;
};

export default Blackboard;
