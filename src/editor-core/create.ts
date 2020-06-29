import ace from "brace";
import { ZillizEditor } from "./ZillizEditor";

export const create = (el: HTMLElement) => {
  const aceEditor = ace.edit(el);
  const zillizEditor = new ZillizEditor(aceEditor);
  zillizEditor.highlightCurrentRequests();
  return zillizEditor;
};
