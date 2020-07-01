import ace from "brace";
import { MilvusEditor } from "./milvus_editor";

export const create = (el: HTMLElement) => {
  const aceEditor = ace.edit(el);
  const zillizEditor = new MilvusEditor(aceEditor);
  zillizEditor.highlightCurrentRequests();
  return zillizEditor;
};
