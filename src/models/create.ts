import ace from "brace";
import { ZillizEditor } from "./ZillizEditor";

export const create = (el: HTMLElement) => {
  const aceEditor = ace.edit(el);
  const zillizEditor = new ZillizEditor(aceEditor);
  /**
   * Init the editor, but the source code is not good, refactor later.
   */
  zillizEditor.highlightCurrentRequestsAndUpdateActionBar();
  return zillizEditor;
};
