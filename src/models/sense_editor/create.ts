
import { SenseEditor } from './sense_editor';
import * as core from '../legacy_core_editor';

export function create(element: HTMLElement) {
  const coreEditor = core.create(element);
  const senseEditor = new SenseEditor(coreEditor);

  /**
   * Init the editor
   */
  senseEditor.highlightCurrentRequestsAndUpdateActionBar();
  return senseEditor;
}
