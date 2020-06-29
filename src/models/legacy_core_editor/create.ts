import ace from "brace";
import { ZillizEditor } from "./ZillizEditor";

export const create = (el: HTMLElement) => {
  const aceEditor = ace.edit(el);
  return new ZillizEditor(aceEditor);
};
