import React from "react";
import { makeStyles } from "@material-ui/styles";
import IconButton from "@material-ui/core/IconButton";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = (params: any) => {
  const { top = 0 } = params;
  return makeStyles({
    actions: {
      position: "absolute",
      width: "100%",
      height: "20px",
      top: `${top}px`,
      right: `20px`,
      zIndex: 100,
      display: top < 0 ? "none" : "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      pointerEvents: "none",
    },
    enableEvent: {
      pointerEvents: "auto",
    },
  })();
};

const _parseReq = (request: any) => {
  const { method, data, url } = request;
  const params = data.length > 0 && JSON.parse(data[0].split("\n").join(""));
  return { method, url, params };
};

const Actions = (props: any) => {
  const { top, editor, requester, handleRes } = props;
  const classes = useStyles({ top });
  const getSession = async (e: any) => {
    editor && console.info(editor.editor.getSession().getState(2));
  };
  const getRequests = async (e: any) => {
    editor &&
      editor.getRequestsInRange().then((res: any) => {
        Promise.all(
          res.map((request: any) => requester(_parseReq(request)))
        ).then((results: any) => handleRes(results));
      });
  };
  return (
    <div className={classes.actions}>
      <IconButton
        size="small"
        onClick={getSession}
        classes={{ root: classes.enableEvent }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={getRequests}
        classes={{ root: classes.enableEvent }}
      >
        <ArrowRightIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

export default Actions;
