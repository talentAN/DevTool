import React, { useState, useEffect, useRef } from "react";
import { create, SenseEditor } from "../models/sense_editor";
import { useUIAceKeyboardMode } from "../plugins/use_ui_ace_keyboard_mode";
import './DevTool.scss'
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
  useEffect(() => {
    editorInstanceRef.current = create(editorRef.current!);
    const editor = editorInstanceRef.current;
    const textareaElement = editorRef.current!.querySelector("textarea");

    if (textareaElement) {
      textareaElement.setAttribute("id", inputId);
    }
    editor.update(DEFAULT_INPUT_VALUE);
    setTextArea(editorRef.current!.querySelector("textarea"));
  }, []);

  return (
    <div id="ConAppEditorActions">
      <div
        ref={editorRef}
        id="ConAppEditor"
        className="conApp__editorContent"
        data-test-subj="request-editor"
      />
    </div>
  );
};

export default DevTools;
