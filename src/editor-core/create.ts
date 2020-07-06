import ace from "brace";
import { MilvusEditor } from "./milvus_editor";

export const create = (el: HTMLElement) => {
  const aceEditor = ace.edit(el);
  const milvusEditor = new MilvusEditor(aceEditor);
  milvusEditor.highlightCurrentRequests();
  return milvusEditor;
};
