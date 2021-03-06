import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import Editor from "./Editor";
import Blackboard from "./Blackboard";

const DevTool = (props: any) => {
  const classes = makeStyles({
    root: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    header: {
      height: "100px",
      border: "solid 1px #0000ff",
    },
    editorContainer: {
      flexGrow: 1,
      display: "flex",
      justifyContent: "space-between",
    },
  })();
  const [result, setResult]: any = useState("");
  const requester = async (data: any) => data;
  const handleRes = (res: any) => {
    const str = JSON.stringify(res, null, 2);
    setResult(str);
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>Header</div>
      <div className={classes.editorContainer}>
        <Editor
          requester={requester}
          handleRes={handleRes}
        />
        <Blackboard value={result} />
      </div>
    </div>
  );
};
export default DevTool;
