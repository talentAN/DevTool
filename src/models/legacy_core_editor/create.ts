import ace from 'brace';
import { LegacyCoreEditor } from './legacy_core_editor';

export const create = (el: HTMLElement) => {
  const actions = document.querySelector<HTMLElement>('#ConAppEditorActions');
  if (!actions) {
    throw new Error('Could not find ConAppEditorActions element!');
  }
  const aceEditor = ace.edit(el);
  return new LegacyCoreEditor(aceEditor, actions);
};
