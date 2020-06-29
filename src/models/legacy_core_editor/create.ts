import ace from "brace";
import { ZillizEditor } from "./legacy_core_editor";

export const create = (el: HTMLElement) => {
  const aceEditor = ace.edit(el);
  return new ZillizEditor(aceEditor);
};
