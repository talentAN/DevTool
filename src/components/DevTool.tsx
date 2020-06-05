import React, { useState, useEffect, useRef } from "react";
import { create, SenseEditor } from "../models/sense_editor";
const DevTools = (props: any) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editorInstanceRef: any = useRef(null);

  useEffect(() => {
    editorInstanceRef.current = create(editorRef.current!);
    const editor = editorInstanceRef.current;
  }, []);

  return <div></div>;
};

export default DevTools;
