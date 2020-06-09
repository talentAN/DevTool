
import { SenseEditor } from './sense_editor';
import * as core from '../legacy_core_editor';

export function create(element: HTMLElement) {
  const coreEditor = core.create(element);
  const senseEditor = new SenseEditor(coreEditor);
  /**
   * Init the editor, but the source code is not good, refactor later.
   */
  senseEditor.highlightCurrentRequestsAndUpdateActionBar();
  return senseEditor;
}
